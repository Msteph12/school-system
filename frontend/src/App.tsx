import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./app/admin/AdminLayout";
import AdminDashboard from "./app/admin/AdminDashboard";
import Students from "./app/pages/admin/Students";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<Students />} />
      </Route>
    </Routes>
  );
}

export default App;
