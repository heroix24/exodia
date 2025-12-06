import { Hono } from "hono";
import { requireAuth } from "../middleware/auth.js";
import { excelService } from "../services/excelService.js";
import { aiService } from "../services/aiService.js";
import { repoService } from "../services/repoService.js";
import { success } from "../utils/http.js";

/**
 * repoRoutes exposes authenticated endpoints for listing repos and publishing
 * AI-generated dashboards derived from Excel data.
 */
export const repoRoutes = new Hono();

repoRoutes.use("*", requireAuth);

repoRoutes.get("/", async (c) => {
  const user = c.get("user");
  const repos = await repoService.list(user.id);
  return c.json(success({ repos }));
});

repoRoutes.post("/:excelId/publish", async (c) => {
  const user = c.get("user");
  const excelId = c.req.param("excelId");
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
  const files = await aiService.generateDashboard(enrichedMetadata);
  const record = await repoService.publish({ userId: user.id, excelId, files });

  return c.json(success({ repo: record }, "Repo published"));
});
