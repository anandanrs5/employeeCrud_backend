const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  fullname: String,
  salary: Number,
  designation: String,
  city: String,
});

const Employee = mongoose.model("employee", employeeSchema);

module.exports = Employee;
