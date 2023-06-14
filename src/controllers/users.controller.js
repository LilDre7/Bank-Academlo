const catchAsync = require("../utils/catchAsync");
const User = require("../models/users.model");
const {
  generateAccountNumber,
} = require("../helpers/accountNumberGenerator");

const AppError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const Transfer = require("../models/tranfers.model");

// == Register === //
exports.register = catchAsync(async (req, res, next) => {
  // Obtener el name y password del req.body
  const { name, password } = req.body;

  // Generar el número de cuenta (puedes usar una lógica personalizada)
  const accountNumber = generateAccountNumber();

  // Crear la constante amount con el valor de 1000
  const amount = 1000;

  // Crear una password con bcrypty para encriptarla
  const salt = await bcrypt.genSalt(12);
  const secretPassword = await bcrypt.hash(password, salt);

  // Crear el usuario con name, accountNumber, password y amount
  const user = await User.create({
    name,
    accountNumber,
    password, // password: secretPassword => Proceso
    amount,
  });

  // Enviar la respuesta al cliente
  res.status(200).json({
    status: "success",
    message: "El usuario se creo correctamente 🦉",
    user,
  });
});

// == Login  == //
exports.login = catchAsync(async (req, res, next) => {
  // Recibir el password y accountNumber del la req.body
  const { password, accountNumber } = req.body;

  // Buscar el usuario donde el status: true , password , amount
  const user = await User.findOne({
    where: {
      status: true,
      accountNumber,
      password,
    },
  });

  // Sino existe el usuario, enviar un error
  if (!user) {
    next(
      new AppError(
        `El numero de cuenta ${accountNumber} o la contraseña no existe  🥷🏾`,
        404
      )
    );
  }

  // Enviar la respuesta al cliente
  res.status(200).json({
    status: "success",
    message: "El usuario se logueo correctamente 🐣",
    data: {
      user,
    },
  });
});

// == History == //
exports.getHistory = catchAsync(async (req, res, next) => {
  // Obtener todas las transferencias hechas por el usuario en sesión

  // Encontrar al usuario por su id
  const userId = req.params.id;

  // Buscar en las transferencias el usuario con su id
  const history = await Transfer.findAll({
    where: {
      senderUserId: userId,
    },
  });

  // Si no existe el historial, enviar un error
  if (history.length === 0) {
    return next(
      new AppError(
        `No tiene historial de transferencias el ${userId} 🦊 `
      )
    );
  }

  // Si existe el historial, enviar el historial
  res.status(200).json({
    status: "success",
    message: "Este es el historial del usuario 🥷🏾",
    history,
  });
});

// Eliminar todos los usuarios de la base de datos
exports.deleteAllUser = catchAsync(async (req, res, next) => {
  const { user } = req.body;

  // Eliminar todos los usuarios de la base de datos
  const deletedUser = await User.destroy({
    where: {
      status: true,
    },
  });

  if (deletedUser === 0) {
    return next(
      new AppError("No hay usuarios para eliminar 🦊 ", 404)
    );
  }

  // Enviar la respuesta al cliente
  res.status(200).json({
    status: "success",
    message: "Todos los usuarios fueron eliminados 🐲 ",
  });
});
