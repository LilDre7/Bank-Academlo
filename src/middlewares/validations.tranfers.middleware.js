const { body, validationResult } = require("express-validator");

const validateFields = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      errors: errors.mapped(),
    });
  }

  next();
};

exports.validationTranfers = [
  body("amount")
    .not()
    .isEmpty()
    .isNumeric()
    .isInt({ min: 100 })
    .withMessage(
      "El monto es requerido y deber ser tipo numerico y deber ser mayor a 100"
    ),
  body("senderUserId")
    .not()
    .isEmpty()
    .withMessage("El id deber ser tipo numerico")
    .isNumeric(),
  body("accountNumber")
    .not()
    .isEmpty()
    .isNumeric()
    .withMessage("El id deber ser tipo numerico"),
  validateFields,
];
