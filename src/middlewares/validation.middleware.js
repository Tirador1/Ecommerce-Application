const reqKeys = ["body", "params", "query", "headers"];

export const validationMiddleware = (schema) => {
  return (req, res, next) => {
    const validationErors = [];
    for (const key of reqKeys) {
      if (schema[key]) {
        const { error } = schema[key]?.validate(req[key], {
          abortEarly: false,
        });
        if (error) {
          validationErors.push({
            [key]: error.details.map((detail) => detail.message),
          });
        }
      }
    }

    if (validationErors.length > 0) {
      return res
        .status(400)
        .json({ message: "Validation Error", validationErors });
    }
    next();
  };
};
