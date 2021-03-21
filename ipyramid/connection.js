/* eslint-disable no-console */
require('dotenv').config();
const mongoose = require("mongoose");

const { NODE_ENV, DBUSER, DBPASSWORD, DBNAME, DBPORT, DBHOST } = process.env;

const isProduction = NODE_ENV === "production";
const connectionStringProd = `mongodb://${encodeURIComponent(
  DBUSER
)}:${encodeURIComponent(DBPASSWORD)}@${DBHOST}:${DBPORT}/${DBNAME}`;
const connectionStringDev = `mongodb://localhost/${DBNAME}`;

const connection = mongoose
  .connect(isProduction ? connectionStringProd : connectionStringDev, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Database connected");
    if (process.send) {
      process.send("ready");
    }
  })
  .catch((e) => {
    console.error("An error occured while trying to connect with the database");
    process.exit(0);
  });

mongoose.connection.once("disconnected", () => {
  console.log("Database disconnected");
  process.exit(0);
});

module.exports = connection;