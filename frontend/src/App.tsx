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
import FinanceOverviewPage from "@/app/admin/finance-overview/page";
import StudentBalancesPage from "@/app/admin/student-balances/page";

import GradesPage from "@/app/pages/admin/Grades";
import ClassesPage from "@/app/admin/grades/Classes";
import SubjectsPerGrade from "@/app/admin/grades/SubjectsPerGrade";
import GradesSubjects from "@/app/admin/grades/GradesSubjects";

import Timetable from "@/app/pages/admin/Timetable";
import Calendar from "@/app/pages/admin/Calendar";
import ExamTimetable from "@/app/pages/admin/ExamTimetable";

import EnterResults from "@/app/admin/results/EnterResults";
import StudentResults from "@/app/admin/results/StudentResults";
import TermLock from "@/app/admin/results/TermLock";
import GradeScalePage from "@/app/admin/results/GradeScalePage";

import AcademicSetupPage from "@/app/pages/admin/AcademicSetup";

import AssessmentsPage from "@/app/admin/assessments/AssessmentsPage";
import AssessmentSetupPage from "@/app/admin/assessments/AssessmentSetupPage";
import CompletedExamsPage from "@/components/admin/assessments/CompletedExamsPage";
import TotalAssessmentsPage from "@/components/admin/assessments/TotalAssessmentsPage";
import UpcomingExamsPage from "@/components/admin/assessments/UpcomingExamsPage";
import OngoingExamsPage from "@/components/admin/assessments/OngoingExamsPage";

import RegistrarLayout from "./app/registrar/RegistrarLayout";
import RegistrarDashboard from "./app/registrar/RegistrarDashboard";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LoginPage from "@/app/pages/admin/LoginPage";

function App() {
  const { user, loading, isAdmin, isRegistrar } = useAuth();

  /* 🔄 AUTH BOOTSTRAP LOADING */
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center gap-2">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-800" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<LoginPage />} />

        {/* ROOT REDIRECT */}
        <Route
          path="/"
          element={
            user ? (
              isAdmin ? (
                <Navigate to="/admin" />
              ) : isRegistrar ? (
                <Navigate to="/registrar" />
              ) : (
                <Navigate to="/admin" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="students-promotion" element={<StudentsPromotion />} />
          <Route
            path="students-promotion/history"
            element={<StudentsPromotionHistory />}
          />
          <Route path="student-attendance" element={<StudentAttendancePage />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="teachers-attendance" element={<TeacherAttendancePage />} />
          <Route
            path="subject-assignments"
            element={<SubjectAssignmentsPage />}
          />
          <Route path="class-teachers" element={<ClassTeachersPage />} />

          <Route path="finance" element={<FeesStructure />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="finance/student-fees" element={<StudentFeesPage />} />
          <Route
            path="finance/finance-overview"
            element={<FinanceOverviewPage />}
          />
          <Route
            path="finance/student-balances"
            element={<StudentBalancesPage />}
          />

          <Route path="grades" element={<GradesPage />} />
          <Route path="classes" element={<ClassesPage />} />
          <Route path="subjects-per-grade" element={<SubjectsPerGrade />} />
          <Route path="subjects/grade/:gradeId" element={<GradesSubjects />} />

          <Route path="timetable" element={<Timetable />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="exam-timetable" element={<ExamTimetable />} />

          <Route path="EnterResults" element={<EnterResults />} />
          <Route path="StudentResults" element={<StudentResults />} />
          <Route path="TermLock" element={<TermLock />} />
          <Route path="GradeScalePage" element={<GradeScalePage />} />

          <Route path="AssessmentsPage" element={<AssessmentsPage />} />
          <Route path="assessments/completed" element={<CompletedExamsPage />} />
          <Route path="assessments/total" element={<TotalAssessmentsPage />} />
          <Route path="assessments/upcoming" element={<UpcomingExamsPage />} />
          <Route path="assessments/ongoing" element={<OngoingExamsPage />} />
          <Route path="assessments/setup" element={<AssessmentSetupPage />} />

          <Route path="AcademicSetup" element={<AcademicSetupPage />} />
        </Route>

        {/* REGISTRAR ROUTES */}
        <Route
          path="/registrar"
          element={
            <ProtectedRoute allowedRoles={["admin", "registrar"]}>
              <RegistrarLayout />
            </ProtectedRoute>
          }
        >
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

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* DEV ONLY */}
      <RoleSwitcher />
    </>
  );
}

export default App;
