export const globalResponse = (err, req, res, next) => {
  if (err) {
    return res.status(err["cause"] || 500).json({
      message: err.message || "Internal server error",
      status: "Catch error",
    });
    next();
  }
};
