const mongoose = require("mongoose");
const dbURL = process.env.DB_URL;
// const dbURL = "mongodb://localhost:27017/employeedata";
mongoose.connect(dbURL);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB!!!");
});
