require("dotenv").config();
const express = require("express");
const colors = require("colors");
const { db } = require("./db/config");
const app = require("./app");

db.authenticate()
  .then(() => console.log(" 😻 Database connected 👻 ".bgGreen.black))
  .catch((err) => console.log(err));

db.sync()
  .then(() =>
    console.log(" 🐣 the database this synced 🤬 ".bgMagenta.red)
  )
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(` 👁️ App is running on ${PORT} 🦉 `.bgBlack);
});
