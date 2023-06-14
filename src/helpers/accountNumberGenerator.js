function generateAccountNumber() {
  // Lo que hago aqui es generar un numero de cuenta aleatorio de 0 a 999999 y redondea hacia abajo
  return Math.floor(Math.random() * 1000000);
}

module.exports = { generateAccountNumber };
