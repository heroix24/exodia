import { Hono } from "hono";
import { requireAuth } from "../middleware/auth.js";
import { excelService } from "../services/excelService.js";
import { aiService } from "../services/aiService.js";
import { repoService } from "../services/repoService.js";
import { success } from "../utils/http.js";
import { normalizeTheme } from "../utils/themes.js";

/**
 * repoRoutes exposes authenticated endpoints for listing repos, publishing
 * AI-generated dashboards derived from Excel data, and creating new apps.
 */
export const repoRoutes = new Hono();

repoRoutes.use("*", requireAuth);

repoRoutes.get("/", async (c) => {
  const user = c.get("user");
  const repos = await repoService.list(user.id);
  return c.json(success({ repos }));
});

/**
 * POST /repos/create
 * Combined endpoint that accepts file upload, credentials, and creates a complete app.
 * This uploads the Excel, generates dashboard, publishes to GitHub, and deploys to Netlify.
 *
 * Form fields:
 * - file: Excel/CSV file (required)
 * - appName: Custom app name (required)
 * - githubToken: GitHub Personal Access Token (required)
 * - netlifyKey: Netlify API key (required)
 * - prompt: Additional AI instructions (optional)
 * - theme: Dashboard theme (optional)
 */
repoRoutes.post("/create", async (c) => {
  const user = c.get("user");
  const body = await c.req.parseBody();

  // Extract form fields
  const fileInput = body.file || body.excel;
  const file = Array.isArray(fileInput) ? fileInput[0] : fileInput;
  const appName = typeof body.appName === "string" ? body.appName.trim() : "";
  const githubToken =
    typeof body.githubToken === "string" ? body.githubToken.trim() : "";
  const netlifyKey =
    typeof body.netlifyKey === "string" ? body.netlifyKey.trim() : "";
  const prompt =
    typeof body.prompt === "string" && body.prompt.trim().length > 0
      ? body.prompt.trim()
      : undefined;
  const theme = normalizeTheme(body?.theme);

  // Validate required fields
  if (!file) {
    return c.json({ status: "error", message: "File is required" }, 400);
  }
  if (!appName) {
    return c.json({ status: "error", message: "App name is required" }, 400);
  }
  if (!githubToken) {
    return c.json(
      { status: "error", message: "GitHub PAT token is required" },
      400
    );
  }
  if (!netlifyKey) {
    return c.json(
      { status: "error", message: "Netlify API key is required" },
      400
    );
  }

  // Step 1: Ingest the Excel file
  const uploadResult = await excelService.ingest({ userId: user.id, file });
  const excelId = uploadResult.excelId;

  // Step 2: Get sheet metadata with rows
  const metadata = await excelService.listSheets({ userId: user.id, excelId });
  const sheetsWithRows = await Promise.all(
    metadata.sheets.map(async (sheet) => {
      const rows = await excelService.getSheetRows({
        userId: user.id,
        excelId,
        sheetName: sheet.name,
      });
      return { ...sheet, rows };
    })
  );
  const enrichedMetadata = { ...metadata, sheets: sheetsWithRows };

  // Step 3: Generate dashboard using AI
  const {
    files,
    source: generator,
    reason: generatorReason,
  } = await aiService.generateDashboard(enrichedMetadata, { prompt, theme });

  // Step 4: Publish to GitHub and deploy to Netlify
  const record = await repoService.publish({
    userId: user.id,
    excelId,
    files,
    theme,
    appName,
    githubToken,
    netlifyToken: netlifyKey,
  });

  return c.json(
    success(
      {
        repo: record,
        excelId,
        generator,
        generatorReason,
      },
      "App created and deployed successfully"
    )
  );
});

/**
 * POST /repos/:excelId/publish
 * Original publish endpoint - publishes an existing Excel file to GitHub.
 * Now supports optional user-provided credentials.
 */
repoRoutes.post("/:excelId/publish", async (c) => {
  const user = c.get("user");
  const excelId = c.req.param("excelId");
  const body = await c.req.json().catch(() => ({}));

  const prompt =
    typeof body?.prompt === "string" && body.prompt.trim().length > 0
      ? body.prompt.trim()
      : undefined;
  const theme = normalizeTheme(body?.theme);
  const appName =
    typeof body?.appName === "string" ? body.appName.trim() : undefined;
  const githubToken =
    typeof body?.githubToken === "string" ? body.githubToken.trim() : undefined;
  const netlifyToken =
    typeof body?.netlifyKey === "string" ? body.netlifyKey.trim() : undefined;

  const metadata = await excelService.listSheets({ userId: user.id, excelId });

  const sheetsWithRows = await Promise.all(
    metadata.sheets.map(async (sheet) => {
      const rows = await excelService.getSheetRows({
        userId: user.id,
        excelId,
        sheetName: sheet.name,
      });
      return { ...sheet, rows };
    })
  );

  const enrichedMetadata = { ...metadata, sheets: sheetsWithRows };
  const {
    files,
    source: generator,
    reason: generatorReason,
  } = await aiService.generateDashboard(enrichedMetadata, { prompt, theme });

  const record = await repoService.publish({
    userId: user.id,
    excelId,
    files,
    theme,
    appName,
    githubToken,
    netlifyToken,
  });

  return c.json(
    success({ repo: record, generator, generatorReason }, "Repo published")
  );
});
