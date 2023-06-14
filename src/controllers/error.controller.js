const sendErrorDev = (err, res) => {
  // Este sendErrorDev es para cuando estamos en desarrollo es una funtion que almacena los errores
  const statusCode = err.statusCode || 500;
  const status = err.status || "fail";
  res.status(statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Existen 2 tipos de errores: Operaciones y del developer
  // Normalmente los de operacion son errores 400
  if (err.isOperational) {
    // Este if nos estamos preguntado si el error es de operacion si el err es operacional que nos tire el err => Operacional es un error del usuario o del cliente
    res.status(statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Si el error es del back o de la base de datos nos muestre un error del programador
    res.status(500).json({
      status: "fail",
      message: "Something went very wrong 🚑 ",
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "fail";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === "production") {
  }

  next();
};

module.exports = globalErrorHandler;
