export const validate = (schema, payload) => {
  const result = schema.safeParse(payload);
  if (!result.success) {
    const error = new Error("Validation failed");
    error.status = 400;
    error.details = result.error.flatten();
    throw error;
  }
  return result.data;
};
