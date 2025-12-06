import { failure } from "../utils/http.js";
import { log } from "../utils/logger.js";

export const errorHandler = (err, c) => {
  const status = err.status || err.statusCode || 500;
  const isServerError = status >= 500;

  if (isServerError) {
    log.error("Unhandled error", err);
  } else {
    log.warn("Request error", err.message);
  }

  return c.json(
    failure(err.message || "Internal server error", err.details),
    status
  );
};
