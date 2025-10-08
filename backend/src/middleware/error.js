class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode; // is class ke ander we not get from super
  }
}
export const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "internal server error";
  console.log(err);
  if (err.name == "CastError") {
    const message = `Invalid" ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name == "JsonWebToken") {
    const message = `json web token is invalid , try again" ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name == "TokenExpiredError") {
    const message = `json web  token is expired , try again  `;
    err = new ErrorHandler(message, 400);
  }
  if (err.code === 11000) {
    const message = `duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
export default ErrorHandler;
