const catchAsync = require("../utils/catchAsync");
const User = require("../models/users.model");
const Transfer = require("../models/tranfers.model");
const globalErrorHandler = require("../controllers/error.controller");
const AppError = require("../utils/appError");

exports.createTranfer = catchAsync(async (req, res, next) => {
  // * 1 Recibir el amount , accountNumber , account , senderUserId == Traerlo del req.body
  const { amount, accountNumber, account, senderUserId } = req.body;

  // * 2  Buscar el usuario que va a recibir el dinero donde el status sea true, donde el accountNumber : accountNumber
  const userReceivesMoney = await User.findOne({
    where: {
      status: true,
      accountNumber: accountNumber,
    },
  });

  // Aqui hago un if para ver si exite el usuario que va recibir la platica
  if (!userReceivesMoney) {
    return next(
      new AppError(
        `No se encontro el ${accountNumber} o no existe 👁️`,
        400
      )
    );
  }

  // * 3  Crear una const que se llame receiverUserId = userRx.id
  const receiverUserId = userReceivesMoney.id;

  // * 4  Buscar al usuario que va a enviar el dinero donde el status sea true y el id sea igaul al usuarios
  const userMakeTransfer = await User.findOne({
    where: {
      status: true,
      id: senderUserId,
    },
  });

  // Verificar si los usuarios existen
  if (!userMakeTransfer || !userReceivesMoney) {
    return next(
      new AppError(
        `No se encontro el usuario ${senderUserId} 👺`,
        400
      )
    );
  }

  // * 5 Verificar si el id del usuario que va a recibir el dinero es igual al id del usuario que va a enviar el dinero , enviar un error
  if (userReceivesMoney.id === userMakeTransfer.id) {
    return next(
      new AppError(
        `No puedes transferir dinero a ti mismo a esta cuenta estas enviado ${accountNumber} 🤡`,
        400
      )
    );
  }

  // * 6 Verificar si el monto a tranferir es mayor que tiene el usuario del paso 4 si eso es asi enviar un mensaje de error
  if (amount > userMakeTransfer.amount) {
    return next(
      new AppError(
        "No puedes transferir mas dinero, no tiene plata mi hom 😟🤑",
        400
      )
    );
  }

  // * 7 Crear una const que se llame newAmountUserMakeTransfer
  // Tendra el resultado de la resta de los monto que tiene el usuario que va a enviar el dinero - menos el monto que va a recibir el dinero
  const newAmountUserMakeTransfer = userMakeTransfer.amount - amount;

  // * 8 Crear crear una const que se llame newAmountUserReciever y tendra el resultado de la suma de los monto que tiene el usuario que va a recibir el dinero + el monto que va a recibir el dinero
  const newAmountUserReciever = userReceivesMoney.amount + amount;

  // * 9 Actualizar la información del usuario que envía con su nuevo monto.
  await userMakeTransfer.update({
    amount: newAmountUserMakeTransfer,
  });

  // * 10 Actualizar la información del usuario que recibe con su nuevo monto.
  await userReceivesMoney.update({ amount: newAmountUserReciever });

  // * 11 Guardar o crear la transferencia en la base de datos
  const createTransfer = await Transfer.create({
    amount,
    // Este va a ser el numero de la cuenta que va a enviar el dinero
    senderUserId,
    // Este va a ser el numero de la cuenta que va a recibir el dinero
    receiverUserId,
  });

  // * 12 Enviar la respuesta al cliente que la transferencia fue exitosa
  return res.status(200).json({
    status: "success",
    message: ` 👁️ La trasferencia fue exitosa y se ha guardado en la base de datos correctamente a esta cuenta se envio ${accountNumber} 👺 `,
    createTransfer,
  });
});

// Eliminar todas las tranferecias de la base de datos
exports.deleteTranfers = catchAsync(async (req, res, next) => {
  // Eliminar tranferencias
  const deletedTranfers = await Transfer.destroy({
    // No de buscar nada => Porque el destroy elimina todo lo que haya en Transfer sin importar que haya
    where: {},
  });

  // Sino hay nada que eliminar enviar un mensaje de error
  if (deletedTranfers === 0) {
    return next(
      new AppError(
        "No hay tranferencias que eliminar 🦊 ",
        400,
        "error"
      )
    );
  }

  // Enviar la respuesta al cliente
  res.status(200).json({
    status: "success",
    message: "Se eliminaron todas las tranferecias",
  });
});
