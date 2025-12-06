import { Octokit } from "@octokit/rest";
import { randomUUID } from "node:crypto";
import { db, hasDatabase } from "../config/db.js";
import { env } from "../env.js";
import { log } from "../utils/logger.js";

const memoryRepos = new Map();

const ensureOctokit = () => {
  if (!env.GITHUB_PAT) {
    const error = new Error(
      "GITHUB_PAT is missing. Set it to enable repo publishing."
    );
    error.status = 400;
    throw error;
  }

  return new Octokit({ auth: env.GITHUB_PAT });
};

const persistRepo = async (record) => {
  if (hasDatabase) {
    try {
      await db.query(
        `INSERT INTO repo (id, user_id, excel_id, github_repo_name, github_repo_url, github_branch, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
         ON CONFLICT (excel_id)
         DO UPDATE SET github_repo_name = EXCLUDED.github_repo_name,
                       github_repo_url = EXCLUDED.github_repo_url,
                       github_branch = EXCLUDED.github_branch,
                       updated_at = NOW()`,
        [
          record.id,
          record.userId,
          record.excelId,
          record.repoName,
          record.repoUrl,
          record.branch,
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
        'SELECT id, user_id AS "userId", excel_id AS "excelId", github_repo_name AS "repoName", github_repo_url AS "repoUrl", github_branch AS "branch", created_at AS "createdAt", updated_at AS "updatedAt" FROM repo WHERE user_id = $1 ORDER BY created_at DESC',
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

export const repoService = {
  async publish({ userId, excelId, files }) {
    const octokit = ensureOctokit();
    const { data: viewer } = await octokit.users.getAuthenticated();
    const repoName = `exodia-${userId.slice(0, 8)}-${excelId.slice(0, 8)}`;

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

    for (const [filePath, content] of Object.entries(files)) {
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

    const record = {
      id: randomUUID(),
      userId,
      excelId,
      repoName,
      repoUrl: repoResponse.data.html_url,
      branch: repoResponse.data.default_branch || "main",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await persistRepo(record);

    return record;
  },

  async list(userId) {
    return listFromStore(userId);
  },
};
