function generateAccountNumber() {
  return Math.floor(Math.random() * 1000000);
}

module.exports = { generateAccountNumber };
