import { Octokit } from "@octokit/rest";
import { randomUUID } from "node:crypto";
import { db, hasDatabase } from "../config/db.js";
import { env } from "../env.js";
import { log } from "../utils/logger.js";
import { normalizeTheme } from "../utils/themes.js";

const memoryRepos = new Map();

/**
 * Creates an Octokit instance using user-provided token or fallback to env var.
 * @param {string} [githubToken] - User-provided GitHub PAT
 */
const createOctokit = (githubToken) => {
  const token = githubToken || env.GITHUB_PAT;
  if (!token) {
    const error = new Error(
      "GitHub PAT is required. Please provide a valid GitHub Personal Access Token."
    );
    error.status = 400;
    throw error;
  }

  return new Octokit({ auth: token });
};

/**
 * Sanitizes app name to be a valid GitHub repo name.
 * @param {string} name - The desired app/repo name
 */
const sanitizeRepoName = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
};

/**
 * Generates netlify.toml config for Vite build
 */
const generateNetlifyConfig = () => `[build]
  command = "npm install && npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "23"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`;

const persistRepo = async (record) => {
  if (hasDatabase) {
    try {
      await db.query(
        `INSERT INTO repo (id, user_id, excel_id, github_repo_name, github_repo_url, github_branch, theme, netlify_site_url, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
         ON CONFLICT (excel_id)
         DO UPDATE SET github_repo_name = EXCLUDED.github_repo_name,
                       github_repo_url = EXCLUDED.github_repo_url,
                       github_branch = EXCLUDED.github_branch,
                       theme = EXCLUDED.theme,
                       netlify_site_url = EXCLUDED.netlify_site_url,
                       updated_at = NOW()`,
        [
          record.id,
          record.userId,
          record.excelId,
          record.repoName,
          record.repoUrl,
          record.branch,
          record.theme,
          record.netlifySiteUrl || null,
        ]
      );
      return;
    } catch (error) {
      log.error(
        "Failed to persist repo metadata in Postgres, falling back to memory store",
        error.message
      );
    }
  }

  memoryRepos.set(record.excelId, record);
};

const listFromStore = async (userId) => {
  if (hasDatabase) {
    try {
      const result = await db.query(
        'SELECT id, user_id AS "userId", excel_id AS "excelId", github_repo_name AS "repoName", github_repo_url AS "repoUrl", github_branch AS "branch", theme, netlify_site_url AS "netlifySiteUrl", created_at AS "createdAt", updated_at AS "updatedAt" FROM repo WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return result.rows;
    } catch (error) {
      log.error(
        "Failed to fetch repos from Postgres, falling back to memory store",
        error.message
      );
    }
  }

  return Array.from(memoryRepos.values()).filter(
    (repo) => repo.userId === userId
  );
};

const bufferFile = (content) => Buffer.from(content).toString("base64");

const fetchExistingSha = async (octokit, owner, repo, path) => {
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path });
    if (!Array.isArray(data)) {
      return data.sha;
    }
  } catch (error) {
    if (error.status === 404) {
      return undefined;
    }
    throw error;
  }

  return undefined;
};

/**
 * Creates a Netlify site linked to a GitHub repo for automatic builds.
 * @param {Object} options
 * @param {string} options.netlifyToken - Netlify API token
 * @param {string} options.siteName - Name for the Netlify site
 * @param {string} options.repoFullName - Full GitHub repo name (owner/repo)
 * @param {string} options.branch - Branch to deploy from
 */
const deployToNetlify = async ({
  netlifyToken,
  siteName,
  repoFullName,
  branch = "main",
}) => {
  if (!netlifyToken) {
    log.warn("Netlify token not provided, skipping Netlify deployment");
    return null;
  }

  const baseUrl = "https://api.netlify.com/api/v1";
  const headers = {
    Authorization: `Bearer ${netlifyToken}`,
    "Content-Type": "application/json",
  };

  try {
    const sanitizedSiteName = sanitizeRepoName(siteName);

    // Try to find existing site first
    const sitesResponse = await fetch(`${baseUrl}/sites`, { headers });

    if (!sitesResponse.ok) {
      throw new Error(
        `Failed to list Netlify sites: ${sitesResponse.statusText}`
      );
    }

    const sites = await sitesResponse.json();
    let existingSite = sites.find(
      (s) =>
        s.name === sanitizedSiteName ||
        s.subdomain === sanitizedSiteName ||
        (s.build_settings?.repo_url &&
          s.build_settings.repo_url.includes(repoFullName))
    );

    let site;
    let finalSiteName = sanitizedSiteName;

    if (existingSite) {
      site = existingSite;
      log.info("Using existing Netlify site", existingSite.name);

      // Update build settings if needed
      const updateResponse = await fetch(`${baseUrl}/sites/${site.id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          repo: {
            provider: "github",
            repo: repoFullName,
            branch: branch,
            cmd: "npm install && npm run build",
            dir: "dist",
          },
        }),
      });

      if (updateResponse.ok) {
        site = await updateResponse.json();
        log.info("Updated Netlify site build settings");
      }
    } else {
      // Create new site linked to GitHub repo
      const createPayload = {
        name: sanitizedSiteName,
        repo: {
          provider: "github",
          repo: repoFullName,
          branch: branch,
          cmd: "npm install && npm run build",
          dir: "dist",
        },
      };

      let createResponse = await fetch(`${baseUrl}/sites`, {
        method: "POST",
        headers,
        body: JSON.stringify(createPayload),
      });

      // If site name is taken, try with random suffix
      if (!createResponse.ok && createResponse.status === 422) {
        finalSiteName = `${sanitizedSiteName}-${randomUUID().slice(0, 8)}`;
        createPayload.name = finalSiteName;

        createResponse = await fetch(`${baseUrl}/sites`, {
          method: "POST",
          headers,
          body: JSON.stringify(createPayload),
        });
      }

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        log.warn("Failed to create linked site, trying simple site", errorText);

        // Fallback: create a simple site without repo linking
        // User will need to manually connect or we trigger a deploy
        const simpleResponse = await fetch(`${baseUrl}/sites`, {
          method: "POST",
          headers,
          body: JSON.stringify({ name: finalSiteName }),
        });

        if (!simpleResponse.ok) {
          throw new Error(
            `Failed to create Netlify site: ${await simpleResponse.text()}`
          );
        }

        site = await simpleResponse.json();
        log.info(
          "Created simple Netlify site (manual deploy needed)",
          finalSiteName
        );
      } else {
        site = await createResponse.json();
        log.info("Created Netlify site linked to GitHub", finalSiteName);
      }
    }

    // Trigger a build if the site is linked to the repo
    if (site.build_settings?.repo_url) {
      try {
        // Must send correct payload format per Netlify API docs
        // Only valid fields are: clear_cache (boolean) and branch (string)
        const buildPayload = {
          clear_cache: true,
          branch: branch,
        };

        log.info("Triggering Netlify build", {
          siteId: site.id,
          branch,
          payload: buildPayload,
        });

        const buildResponse = await fetch(
          `${baseUrl}/sites/${site.id}/builds`,
          {
            method: "POST",
            headers,
            body: JSON.stringify(buildPayload),
          }
        );

        if (buildResponse.ok) {
          const build = await buildResponse.json();
          log.info("Triggered Netlify build successfully", {
            buildId: build.id,
            branch,
          });
        } else {
          const errorText = await buildResponse.text();
          log.warn("Netlify build trigger returned non-OK status", {
            status: buildResponse.status,
            error: errorText,
          });
        }
      } catch (buildError) {
        log.warn("Failed to trigger build", buildError.message);
      }
    }

    const siteUrl =
      site.ssl_url || site.url || `https://${site.subdomain}.netlify.app`;

    log.info("Netlify site ready", {
      siteUrl,
      siteId: site.id,
      linked: !!site.build_settings?.repo_url,
    });

    return {
      siteId: site.id,
      siteName: site.name || site.subdomain,
      siteUrl,
      adminUrl: `https://app.netlify.com/sites/${site.name || site.subdomain}`,
      linked: !!site.build_settings?.repo_url,
    };
  } catch (error) {
    log.error("Netlify deployment failed", error.message);
    return { error: error.message };
  }
};

export const repoService = {
  /**
   * Publishes dashboard files to GitHub and optionally deploys to Netlify.
   * @param {Object} options
   * @param {string} options.userId - User ID
   * @param {string} options.excelId - Excel file ID
   * @param {Object} options.files - Files to publish
   * @param {string} [options.theme] - Dashboard theme
   * @param {string} [options.appName] - Custom app/repo name
   * @param {string} [options.githubToken] - User's GitHub PAT
   * @param {string} [options.netlifyToken] - User's Netlify API key
   */
  async publish({
    userId,
    excelId,
    files,
    theme,
    appName,
    githubToken,
    netlifyToken,
  }) {
    const octokit = createOctokit(githubToken);
    const { data: viewer } = await octokit.users.getAuthenticated();

    // Use custom app name or generate default
    const repoName = appName
      ? sanitizeRepoName(appName)
      : `exodia-${userId.slice(0, 8)}-${excelId.slice(0, 8)}`;

    let repoResponse;
    try {
      repoResponse = await octokit.repos.createForAuthenticatedUser({
        name: repoName,
        private: false,
        description: "Generated automatically by Exodia",
        auto_init: true,
      });
    } catch (error) {
      if (error.status === 422) {
        log.warn("Repo already exists, continuing with uploads", repoName);
        repoResponse = await octokit.repos.get({
          owner: viewer.login,
          repo: repoName,
        });
      } else {
        throw error;
      }
    }

    const owner = repoResponse.data.owner.login;
    const repoFullName = `${owner}/${repoName}`;

    // Fetch the repo to ensure we have the correct default branch
    // (auto_init creates with user's default branch setting, which may be 'master' or 'main')
    const repoDetails = await octokit.repos.get({
      owner,
      repo: repoName,
    });
    const defaultBranch = repoDetails.data.default_branch || "main";
    log.info("Detected default branch", { repoFullName, defaultBranch });

    // Add netlify.toml to files for proper build configuration
    const filesWithNetlify = {
      ...files,
      "netlify.toml": generateNetlifyConfig(),
    };

    for (const [filePath, content] of Object.entries(filesWithNetlify)) {
      const existingSha = await fetchExistingSha(
        octokit,
        owner,
        repoName,
        filePath
      );

      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo: repoName,
        path: filePath,
        message: `${existingSha ? "Update" : "Add"} ${filePath}`,
        content: bufferFile(content),
        ...(existingSha ? { sha: existingSha } : {}),
      });
    }

    // Deploy to Netlify if token provided - now links to GitHub repo
    let netlifyResult = null;
    if (netlifyToken) {
      netlifyResult = await deployToNetlify({
        netlifyToken,
        siteName: repoName,
        repoFullName,
        branch: defaultBranch,
      });
    }

    const record = {
      id: randomUUID(),
      userId,
      excelId,
      repoName,
      repoUrl: repoResponse.data.html_url,
      branch: defaultBranch,
      theme: normalizeTheme(theme),
      netlifySiteUrl: netlifyResult?.siteUrl || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await persistRepo(record);

    return {
      ...record,
      netlify: netlifyResult,
    };
  },

  async list(userId) {
    return listFromStore(userId);
  },
};
