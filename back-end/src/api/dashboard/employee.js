const express = require("express");
const router = express.Router();
const Employee = require("../../models/employee");
const User = require("../../models/user");
const secretKey = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");

function verifyToken(request, response, next) {
  const authToken = request.headers.authorization;
  if (!authToken) {
    return response
      .status(401)
      .json({ error: "Access denied. Token is missing." });
  }
  try {
    const tokenParts = authToken.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      throw new Error("Invalid token format");
    }
    const decoded = jwt.verify(tokenParts[1], secretKey);
    request.user = decoded;
    next();
  } catch (err) {
    return response.status(401).json({ error: "Invalid token" });
  }
}

router.post("/add", verifyToken, async (request, response) => {
  try {
    const { fullname, salary, designation, city } = request.body;

    const newEmployee = new Employee({ fullname, salary, designation, city });

    await newEmployee.save();

    response
      .status(201)
      .json({ message: "Employee details created successfully" });
  } catch (err) {
    console.error("Error creating employee details:", err);
    response.status(500).json({ error: "Internal server error" });
  }
});

router.get("/view", verifyToken, async (request, response) => {
  try {
    const employees = await Employee.find();

    response.status(200).json(employees);
  } catch (err) {
    console.error("Error fetching employees:", err);
    response.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/delete/:id", verifyToken, async (request, response) => {
  try {
    const { id } = request.params;
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) {
      return response.status(404).json({ error: "Employee not found" });
    }

    response.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

router.put("/edit/:id", verifyToken, async (request, response) => {
  try {
    const { id } = request.params;
    const { fullname, salary, designation, city } = request.body;

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { fullname, salary, designation, city },
      { new: true }
    );

    if (!updatedEmployee) {
      return response.status(404).json({ error: "Employee not found" });
    }

    response.json({
      message: "Employee details updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("Error updating employee details:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

router.get("/view/:id", verifyToken, async (request, response) => {
  try {
    const { id } = request.params;
    const employee = await Employee.findById(id);

    if (!employee) {
      return response.status(404).json({ error: "Employee not found" });
    }

    response.status(200).json(employee);
  } catch (error) {
    console.error("Error fetching employee details:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
