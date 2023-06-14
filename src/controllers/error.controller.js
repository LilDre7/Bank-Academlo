// Imports
const AppError = require("../utils/appError");

// ¿Que hace este logger? 🚨
// Bueno este logger con la libreria de winston nos damos un ayudita para saber con las config que yo haya creado mi funcion el error en un archivo especifico asi podemos saber en cualquir momento de cualquier error que se haya creado o pues ejuecuatdo
const logger = require("../utils/logger");

// Esta funtion es para saber el error del token duplicado
const handleCastftokenError = () => {
  return new AppError(`Invalid token or same token 🦧`, 400);
};

const sendErrorDev = (err, res) => {
  logger.info(err);
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
  logger.info(err);
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
    // Esta variable y este if es para validar que en produccion si hay un error de operacion nos muestre un mensaje algo mas declaritivo para el usuario quiere decir un mensaje que le demuestre al cliente algo mas logico sobre el error y que pueda entender 🐲
    let error = err;
    // Validar los errores de 400 a 500
    if (error.parent.code === "23505") {
      error = handleCastftokenError();
    }
    sendErrorProd(error, res);
  }
  next();
};

module.exports = globalErrorHandler;
