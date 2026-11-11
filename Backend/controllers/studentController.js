const Student = require("../models/Student");

// CREATE STUDENT
exports.createStudent = async (req, res) => {
    try {
        const { name, age, qualification, files } = req.body;

        const student = await Student.create({
            name,
            age,
            qualification,
            files: files || [],
            user: req.user.id
        });

        res.status(201).json({
            message: "Student created successfully",
            student
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET STUDENTS
exports.getStudents = async (req, res) => {
    try {
        const students = await Student.find({
            user: req.user.id
        });

        res.json(students);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE STUDENT
exports.updateStudent = async (req, res) => {
    try {
        const student = await Student.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student updated successfully",
            student
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE STUDENT
exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student deleted successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};