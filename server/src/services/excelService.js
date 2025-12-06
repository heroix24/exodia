import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import xlsx from "xlsx";
import { env } from "../env.js";
import {
  ensureUserDir,
  getExcelPath,
  getMetadataPath,
} from "../config/storage.js";
import { log } from "../utils/logger.js";

const METADATA_VERSION = 1;

const readJsonFile = async (filePath) => {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
};

const writeJsonFile = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
};

const detectColumnType = (values) => {
  const meaningful = values.filter(
    (value) => value !== null && value !== undefined && value !== ""
  );

  if (!meaningful.length) {
    return "string";
  }

  if (meaningful.every((value) => typeof value === "number")) {
    return "number";
  }

  if (meaningful.every((value) => typeof value === "boolean")) {
    return "boolean";
  }

  const maybeDates = meaningful.every(
    (value) => value instanceof Date || !Number.isNaN(Date.parse(value))
  );
  if (maybeDates) {
    return "date";
  }

  return "string";
};

const buildMetadata = (workbook) => {
  return {
    version: METADATA_VERSION,
    generatedAt: new Date().toISOString(),
    sheets: workbook.SheetNames.map((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const rows = xlsx.utils.sheet_to_json(sheet, { defval: null, raw: true });
      const columns = Object.keys(rows[0] ?? {});

      const columnDefinitions = columns.map((column) => ({
        name: column,
        label: column,
        type: detectColumnType(rows.map((row) => row[column])),
      }));

      return {
        name: sheetName,
        label: sheetName,
        rowCount: rows.length,
        columns: columnDefinitions,
      };
    }),
  };
};

const loadWorkbook = async (userId, excelId) => {
  const workbookPath = getExcelPath(userId, excelId);
  const buffer = await fs.readFile(workbookPath);
  const workbook = xlsx.read(buffer, { type: "buffer" });
  return { workbookPath, workbook };
};

const persistWorkbook = async (workbook, workbookPath) => {
  xlsx.writeFile(workbook, workbookPath);
};

const ensureSheetExists = (workbook, sheetName) => {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    const error = new Error(
      `Sheet "${sheetName}" was not found in this workbook`
    );
    error.status = 404;
    throw error;
  }
  return sheet;
};

const rowIdFromIndex = (index) => index + 2; // +2 to account for header row (row #1)

export const excelService = {
  async ingest({ userId, file }) {
    if (!file) {
      const error = new Error(
        'Excel file was not provided. Use the "file" form field.'
      );
      error.status = 400;
      throw error;
    }

    if (
      file.type &&
      !file.name?.endsWith(".xls") &&
      !file.name?.endsWith(".xlsx")
    ) {
      log.warn("Upload does not end with .xls/.xlsx, continuing anyway");
    }

    const excelId = randomUUID();
    await ensureUserDir(userId);
    const workbookPath = getExcelPath(userId, excelId);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await fs.writeFile(workbookPath, buffer);

    const workbook = xlsx.read(buffer, { type: "buffer" });
    const metadata = buildMetadata(workbook);
    const metadataPath = getMetadataPath(userId, excelId);
    await writeJsonFile(metadataPath, metadata);

    return { excelId, metadata };
  },

  async listSheets({ userId, excelId }) {
    const metadata = await readJsonFile(getMetadataPath(userId, excelId));
    if (!metadata) {
      const error = new Error(
        "Workbook metadata not found. Upload the Excel again."
      );
      error.status = 404;
      throw error;
    }
    return { ...metadata, excelId };
  },

  async getSheetRows({ userId, excelId, sheetName }) {
    const { workbook } = await loadWorkbook(userId, excelId);
    const sheet = ensureSheetExists(workbook, sheetName);
    const rows = xlsx.utils.sheet_to_json(sheet, { defval: null, raw: true });

    return rows.map((row, index) => ({
      rowId: rowIdFromIndex(index),
      ...row,
    }));
  },

  async appendRow({ userId, excelId, sheetName, payload }) {
    const { workbook, workbookPath } = await loadWorkbook(userId, excelId);
    const sheet = ensureSheetExists(workbook, sheetName);

    xlsx.utils.sheet_add_json(sheet, [payload], {
      skipHeader: true,
      origin: -1,
    });
    workbook.Sheets[sheetName] = sheet;

    await persistWorkbook(workbook, workbookPath);
    await this.refreshMetadata({ userId, excelId, workbook });

    return this.getSheetRows({ userId, excelId, sheetName });
  },

  async updateRow({ userId, excelId, sheetName, rowId, payload }) {
    const { workbook, workbookPath } = await loadWorkbook(userId, excelId);
    const sheet = ensureSheetExists(workbook, sheetName);

    const matrix = xlsx.utils.sheet_to_json(sheet, { header: 1, raw: true });
    const header = matrix[0];
    const targetIndex = rowId - 1;

    if (targetIndex <= 0 || targetIndex >= matrix.length) {
      const error = new Error(
        `Row ${rowId} does not exist in sheet ${sheetName}`
      );
      error.status = 404;
      throw error;
    }

    const newRow = header.map((column) => payload[column] ?? null);
    matrix[targetIndex] = newRow;

    workbook.Sheets[sheetName] = xlsx.utils.aoa_to_sheet(matrix);
    await persistWorkbook(workbook, workbookPath);
    await this.refreshMetadata({ userId, excelId, workbook });

    return this.getSheetRows({ userId, excelId, sheetName });
  },

  async deleteRow({ userId, excelId, sheetName, rowId }) {
    const { workbook, workbookPath } = await loadWorkbook(userId, excelId);
    const sheet = ensureSheetExists(workbook, sheetName);

    const matrix = xlsx.utils.sheet_to_json(sheet, { header: 1, raw: true });
    const targetIndex = rowId - 1;

    if (targetIndex <= 0 || targetIndex >= matrix.length) {
      const error = new Error(
        `Row ${rowId} does not exist in sheet ${sheetName}`
      );
      error.status = 404;
      throw error;
    }

    matrix.splice(targetIndex, 1);

    workbook.Sheets[sheetName] = xlsx.utils.aoa_to_sheet(matrix);
    await persistWorkbook(workbook, workbookPath);
    await this.refreshMetadata({ userId, excelId, workbook });

    return this.getSheetRows({ userId, excelId, sheetName });
  },

  async refreshMetadata({ userId, excelId, workbook }) {
    const existingWorkbook =
      workbook ?? (await loadWorkbook(userId, excelId)).workbook;
    const metadata = buildMetadata(existingWorkbook);
    await writeJsonFile(getMetadataPath(userId, excelId), metadata);
    return metadata;
  },
};
