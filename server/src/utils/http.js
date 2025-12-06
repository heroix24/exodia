export const success = (data, message = "ok") => ({
  status: "success",
  message,
  data,
});

export const failure = (message, details) => ({
  status: "error",
  message,
  details,
});
