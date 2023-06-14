// Creacion de la ruta users
const express = require("express");

// Importacion de los controladores
const usersController = require("../controllers/users.controller");

// ** Middleware ** //
const userValidations = require("../middlewares/validations.users.middleware");

const router = express.Router();

//== Rutas ==//
router
  .route("/signup")
  .post(userValidations.validationsUsers, usersController.register);

router.route("/login").post(usersController.login);

router.route("/:id/history").get(usersController.getHistory);

// Delete
router.route("/deleteUser").delete(usersController.deleteAllUser);

module.exports = router;
