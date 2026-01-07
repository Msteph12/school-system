import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./app/admin/AdminLayout";
import AdminDashboard from "./app/admin/AdminDashboard";
import Students from "./app/pages/admin/Students";
import StudentsPromotion from "@/app/admin/students-promotion/page";
import StudentsPromotionHistory from "@/app/admin/students-promotion/history/page";
import StudentAttendancePage from "@/app/admin/student-attendance";
import Teachers from "@/app/pages/admin/Teachers";
import TeacherAttendancePage from "@/app/admin/teacher-attendance";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="students-promotion" element={<StudentsPromotion />}/>
        <Route path="students-promotion/history" element={<StudentsPromotionHistory />}/>
        <Route path="student-attendance" element={<StudentAttendancePage />} /> 
        <Route path="teachers" element={<Teachers />} />
        <Route path="teachers-attendance" element={<TeacherAttendancePage />} />
      </Route>
    </Routes>
  );
}

export default App;
