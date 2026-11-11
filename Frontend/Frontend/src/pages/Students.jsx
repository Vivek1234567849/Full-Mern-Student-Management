import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Students() {

    const { user, logout } = useAuth();

    const [students, setStudents] = useState([]);

    const [form, setForm] = useState({
        name: "",
        age: "",
        qualification: ""
    });

    const [editId, setEditId] = useState(null);

    const getStudents = async () => {
        try {
            const response = await api.get("/student/get");
            setStudents(response.data);
        } catch (error) {
            console.log(error.response?.data?.message);
        }
    };

    useEffect(() => {
        getStudents();
    }, []);

    // CREATE / UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            if (editId) {
                await api.put(`/student/update/${editId}`, form);
                alert("Student updated");
            } else {
                await api.post("/student/create", form);
                alert("Student created");
            }

            setForm({
                name: "",
                age: "",
                qualification: ""
            });

            setEditId(null);
            getStudents();

        } catch (error) {
            alert(error.response?.data?.message || "Operation failed");
        }
    };

    // EDIT
    const handleEdit = (student) => {

        setEditId(student._id);

        setForm({
            name: student.name,
            age: student.age,
            qualification: student.qualification
        });
    };

    // DELETE
    const handleDelete = async (id) => {

        if (!window.confirm("Delete this student?")) return;

        try {
            await api.delete(`/student/delete/${id}`);
            getStudents();
            alert("Student deleted");

        } catch (error) {
            alert(error.response?.data?.message || "Delete failed");
        }
    };

    // LOGOUT
    const handleLogout = async () => {
        await logout();
        window.location.href = "/login";
    };

    return (
        <div className="dashboard">

            <nav className="navbar">
                <h2>Student Management</h2>

                <div>
                    <span>Welcome, {user?.name}</span>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </nav>

            <div className="content">

                <form onSubmit={handleSubmit} className="student-form">

                    <h2>{editId ? "Update Student" : "Add Student"}</h2>

                    <input
                        placeholder="Student Name"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                        required
                    />

                    <input
                        type="number"
                        placeholder="Student Age"
                        value={form.age}
                        onChange={(e) =>
                            setForm({ ...form, age: e.target.value })
                        }
                        required
                    />

                    <select
                        value={form.qualification}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                qualification: e.target.value
                            })
                        }
                        required
                    >
                        <option value="">Select Qualification</option>
                        <option value="Primary">Primary</option>
                        <option value="Middle">Middle</option>
                        <option value="Secondary">Secondary</option>
                        <option value="Undergraduate">Undergraduate</option>
                    </select>

                    <button type="submit">
                        {editId ? "Update Student" : "Add Student"}
                    </button>

                    {editId && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditId(null);
                                setForm({
                                    name: "",
                                    age: "",
                                    qualification: ""
                                });
                            }}
                        >
                            Cancel
                        </button>
                    )}

                </form>

                <h2>All Students</h2>

                <div className="student-list">

                    {students.map((student) => (

                        <div className="student-card" key={student._id}>

                            <h3>{student.name}</h3>

                            <p>Age: {student.age}</p>

                            <p>Qualification: {student.qualification}</p>

                            <button onClick={() => handleEdit(student)}>
                                Edit
                            </button>

                            <button onClick={() => handleDelete(student._id)}>
                                Delete
                            </button>

                        </div>

                    ))}

                    {students.length === 0 && (
                        <p>No students found.</p>
                    )}

                </div>

            </div>

        </div>
    );
}

export default Students;