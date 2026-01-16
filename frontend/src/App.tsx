import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import RoleSwitcher from "./components/dev/RoleSwitcher";

import AdminLayout from "./app/admin/AdminLayout";
import AdminDashboard from "./app/admin/AdminDashboard";
import Students from "./app/pages/admin/Students";
import StudentsPromotion from "@/app/admin/students-promotion/page";
import StudentsPromotionHistory from "@/app/admin/students-promotion/history/page";
import StudentAttendancePage from "@/app/admin/student-attendance";
import Teachers from "@/app/pages/admin/Teachers";
import TeacherAttendancePage from "@/app/admin/teacher-attendance";
import SubjectAssignmentsPage from "@/app/admin/subject-assignments/page";
import ClassTeachersPage from "@/app/admin/class-teachers/page";
import FeesStructure from "@/app/pages/admin/Finance";
import PaymentsPage from "@/app/admin/payments/page";
import StudentFeesPage from "@/app/admin/student-fees/page";
import GradesPage from "@/app/pages/admin/Grades";

import RegistrarLayout from "./app/registrar/RegistrarLayout";
import RegistrarDashboard from "./app/registrar/RegistrarDashboard";

function App() {
  const { user, isAdmin, isRegistrar } = useAuth();

  // TEMP dev-safe fallback (prevents blank page)
  if (!user) {
    return <div>Loading user...</div>;
  }

  return (
    <>
      <Routes>
        {/* Root redirect */}
        <Route
          path="/"
          element={
            isAdmin ? (
              <Navigate to="/admin" />
            ) : isRegistrar ? (
              <Navigate to="/registrar" />
            ) : (
              <Navigate to="/admin" />
            )
          }
        />

        {/* ADMIN */}
        {isAdmin && (
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="students-promotion" element={<StudentsPromotion />} />
            <Route
              path="students-promotion/history"
              element={<StudentsPromotionHistory />}
            />
            <Route
              path="student-attendance"
              element={<StudentAttendancePage />}
            />
            <Route path="teachers" element={<Teachers />} />
            <Route
              path="teachers-attendance"
              element={<TeacherAttendancePage />}
            />
            <Route
              path="subject-assignments"
              element={<SubjectAssignmentsPage />}
            />
            <Route path="class-teachers" element={<ClassTeachersPage />} />
            <Route path="finance" element={<FeesStructure />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route
              path="finance/student-fees"
              element={<StudentFeesPage />}
            />
            <Route path="grades" element={<GradesPage />} /> 
          </Route>
        )}

        {/* REGISTRAR */}
        {(isRegistrar || isAdmin) && (
          <Route path="/registrar" element={<RegistrarLayout />}>
            <Route index element={<RegistrarDashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="students-promotion" element={<StudentsPromotion />} />
            <Route
              path="students-promotion/history"
              element={<StudentsPromotionHistory />}
            />
            <Route
              path="teachers-attendance"
              element={<TeacherAttendancePage />}
            />
          </Route>
        )}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* DEV ONLY */}
      <RoleSwitcher />
    </>
  );
}

export default App;
