import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./app/admin/AdminLayout";
import AdminDashboard from "./app/admin/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
