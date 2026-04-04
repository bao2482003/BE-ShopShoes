const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes");
const { handleError } = require("./middlewares/error.middleware");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", routes);
app.use(handleError);

module.exports = app;
