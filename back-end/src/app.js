const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();
const port = process.env.PORT || 3002;
const db = require("./db");
const cors = require("cors");
app.use(cors());

const signup = require("./api/authentication/signup");
app.use("/api/signup", signup);

const login = require("./api/authentication/login");
app.use("/api/login", login);

const employee = require("./api/dashboard/employee");
app.use("/api/employee", employee);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is Running on Port ${port}`);
});
