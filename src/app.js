const cors = require("cors");
const morgan = require("morgan");
const express = require("express");

// ** Utils ** //
const AppError = require("./utils/appError");

// Middleware de erroes
const globalErrorHandler = require("./controllers/error.controller");

// ** Routes ** //
const usersRouter = require("./routes/users.routes");
const transferRouter = require("./routes/tranfers.routes");

// ** Config ** //
const app = express();

app.use(express.json());

// Cors es para que el servidor pueda comunicarse con el front
app.use(cors());

// Morgan sirve para ver las peticiones en consola
// Este if es para tener a morgan solo en desarrollo de la app
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ** Ruta principales ** //
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/transfer", transferRouter);

// !! Para todas las rutas que no sea correctas
app.use("*", (req, res, next) => {
  return next(
    new AppError(
      `La ruta es incorrecta o no valida ${req.originalUrl} 🚑 `,
      404,
      "fail"
    )
  );
});

// ** Middleware de errores ** //
app.use(globalErrorHandler);

// ** Export ** //
module.exports = app;
