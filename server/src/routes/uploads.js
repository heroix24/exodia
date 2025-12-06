import { Hono } from "hono";
import { requireAuth } from "../middleware/auth.js";
import { excelService } from "../services/excelService.js";
import { success } from "../utils/http.js";

/**
 * uploadRoutes handles authenticated file uploads (Excel or CSV) before downstream
 * processing by excelService. CSV files are automatically converted to XLSX.
 */
export const uploadRoutes = new Hono();

uploadRoutes.use("*", requireAuth);

uploadRoutes.post("/excel", async (c) => {
  const user = c.get("user");
  const body = await c.req.parseBody();
  const fileInput = body.file || body.excel;
  const file = Array.isArray(fileInput) ? fileInput[0] : fileInput;

  const result = await excelService.ingest({ userId: user.id, file });
  const message = result.convertedFromCSV 
    ? "CSV converted to Excel and uploaded" 
    : "Excel uploaded";
  return c.json(success(result, message));
});
