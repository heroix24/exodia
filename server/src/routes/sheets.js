import { Hono } from "hono";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { excelService } from "../services/excelService.js";
import { success } from "../utils/http.js";
import { validate } from "../utils/validation.js";

const rowPayloadSchema = z.record(z.any());

/**
 * sheetRoutes provides authenticated endpoints for listing sheets and managing
 * row data inside an uploaded Excel workbook.
 */
export const sheetRoutes = new Hono();

sheetRoutes.use("*", requireAuth);

sheetRoutes.get("/:excelId", async (c) => {
  const user = c.get("user");
  const metadata = await excelService.listSheets({
    userId: user.id,
    excelId: c.req.param("excelId"),
  });
  return c.json(success(metadata));
});

sheetRoutes.get("/:excelId/:sheetName", async (c) => {
  const user = c.get("user");
  const rows = await excelService.getSheetRows({
    userId: user.id,
    excelId: c.req.param("excelId"),
    sheetName: c.req.param("sheetName"),
  });
  return c.json(success({ rows }));
});

sheetRoutes.post("/:excelId/:sheetName/rows", async (c) => {
  const user = c.get("user");
  const body = await c.req.json();
  const payload = validate(rowPayloadSchema, body);
  const rows = await excelService.appendRow({
    userId: user.id,
    excelId: c.req.param("excelId"),
    sheetName: c.req.param("sheetName"),
    payload,
  });
  return c.json(success({ rows }, "Row created"));
});

sheetRoutes.put("/:excelId/:sheetName/rows/:rowId", async (c) => {
  const user = c.get("user");
  const rowId = Number(c.req.param("rowId"));
  if (Number.isNaN(rowId)) {
    return c.json({ status: "error", message: "rowId must be a number" }, 400);
  }

  const body = await c.req.json();
  const payload = validate(rowPayloadSchema, body);
  const rows = await excelService.updateRow({
    userId: user.id,
    excelId: c.req.param("excelId"),
    sheetName: c.req.param("sheetName"),
    rowId,
    payload,
  });
  return c.json(success({ rows }, "Row updated"));
});

sheetRoutes.delete("/:excelId/:sheetName/rows/:rowId", async (c) => {
  const user = c.get("user");
  const rowId = Number(c.req.param("rowId"));
  if (Number.isNaN(rowId)) {
    return c.json({ status: "error", message: "rowId must be a number" }, 400);
  }

  const rows = await excelService.deleteRow({
    userId: user.id,
    excelId: c.req.param("excelId"),
    sheetName: c.req.param("sheetName"),
    rowId,
  });
  return c.json(success({ rows }, "Row deleted"));
});
