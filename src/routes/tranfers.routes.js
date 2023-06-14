// ** Creacion de las rutas para las tranferencias ** //
const express = require("express");

// Middleware
const validationTrasfer = require("../middlewares/validations.tranfers.middleware");

// controllers
const tranfersController = require("../controllers/tranfers.controller");

// Routes
const router = express.Router();

router
  .route("/")
  .post(
    validationTrasfer.validationTranfers,
    tranfersController.createTranfer
  );

// Eliminar todas las tranferecias de la base de datos
router
  .route("/deleteAllUsers")
  .delete(tranfersController.deleteTranfers);

module.exports = router;
