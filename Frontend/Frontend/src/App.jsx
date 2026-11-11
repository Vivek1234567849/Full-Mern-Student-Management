import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Students from "./pages/Students";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

    return (

        <AuthProvider>

            <BrowserRouter>

                <Routes>

                    <Route path="/" element={<Navigate to="/students" />} />

                    <Route path="/login" element={<Login />} />

                    <Route path="/register" element={<Register />} />

                    <Route element={<ProtectedRoute />}>

                        <Route path="/students" element={<Students />} />

                    </Route>

                </Routes>

            </BrowserRouter>

        </AuthProvider>

    );
}

export default App;