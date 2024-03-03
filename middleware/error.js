export const errorHandler = (err, req, res, next) => {
  console.log(err.stack);
  res.status(400).json({ success: false, msg: err.message });
};
