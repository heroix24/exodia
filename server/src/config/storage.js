import fs from "node:fs/promises";
import path from "node:path";
import { env } from "../env.js";

export const ensureUploadRoots = async () => {
  await fs.mkdir(env.UPLOAD_DIR, { recursive: true });
};

export const getUserUploadDir = (userId) => path.join(env.UPLOAD_DIR, userId);
export const getExcelPath = (userId, excelId) =>
  path.join(getUserUploadDir(userId), `${excelId}.xlsx`);
export const getMetadataPath = (userId, excelId) =>
  path.join(getUserUploadDir(userId), `${excelId}.meta.json`);

export const ensureUserDir = async (userId) => {
  const dir = getUserUploadDir(userId);
  await fs.mkdir(dir, { recursive: true });
  return dir;
};
