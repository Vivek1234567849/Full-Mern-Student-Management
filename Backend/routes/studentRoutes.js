const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createStudent,
    getStudents,
    updateStudent,
    deleteStudent
} = require("../controllers/studentController");

// Authentication required for every route
router.use(authMiddleware);

router.post("/create", createStudent);
router.get("/get", getStudents);
router.put("/update/:id", updateStudent);
router.delete("/delete/:id", deleteStudent);

module.exports = router;