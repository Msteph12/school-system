import { NavLink, Link } from "react-router-dom";
import { FiChevronRight, FiCircle } from "react-icons/fi";

const Sidebar = ({ collapsed = false }: { collapsed?: boolean }) => {
  const linkClass =
    "block px-4 py-2 text-sm rounded hover:bg-blue-600 hover:text-white";

  const dropdownItem =
    "block px-4 py-1 ml-8 text-sm text-gray-700 hover:text-blue-600";

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-64"
      } bg-blue-300 text-white flex flex-col transition-all duration-300`}
    >
      {/* Header */}
      <div className="px-4 py-4 font-bold text-black text-lg border-b border-blue-600 text-center">
        {!collapsed && "School Admin"}
      </div>

      <nav className="flex-1 p-3 space-y-1">
        <NavLink to="/admin" className={`${linkClass} flex items-center gap-3`}>
          <span>🏠</span>
          {!collapsed && <span>System Overview</span>}
        </NavLink>

        {/* Students */}
        <details className="group">
          <summary className={`${linkClass} flex items-center gap-3 cursor-pointer list-none`}>
            <span>📚</span>
            {!collapsed && <span className="flex-1">Students</span>}
            {!collapsed && <FiChevronRight className="transition-transform group-open:rotate-90" />}
          </summary>

          {!collapsed && (
            <>
              <NavLink to="/admin/students" className={`${dropdownItem} flex items-center gap-2`}>
                <FiCircle className="w-2 h-2" /> <span>All Students</span>
              </NavLink>
              <Link to="/admin/students-promotion" className={`${dropdownItem} flex items-center gap-2`}>
                <FiCircle className="w-2 h-2" /> <span>Student Promotion</span>
              </Link>
              <Link to="/admin/students-promotion/history" className={`${dropdownItem} flex items-center gap-2`}>
                <FiCircle className="w-2 h-2" /> <span>Promotion History</span>
              </Link>
              <NavLink to="/admin/student-attendance" className={`${dropdownItem} flex items-center gap-2`}>
                <FiCircle className="w-2 h-2" /> <span>Student Attendance</span>
              </NavLink>
            </>
          )}
        </details>

        {/* Teachers */}
        <details className="group">
          <summary className={`${linkClass} flex items-center gap-3 cursor-pointer list-none`}>
            <span>👤</span>
            {!collapsed && <span className="flex-1">Teachers</span>}
            {!collapsed && <FiChevronRight className="transition-transform group-open:rotate-90" />}
          </summary>

          {!collapsed && (
            <>
              <NavLink to="/admin/teachers" className={`${dropdownItem} flex items-center gap-2`}>
                <FiCircle className="w-2 h-2" /> <span>All Teachers</span>
              </NavLink>
              <NavLink to="/admin/teachers-attendance" className={`${dropdownItem} flex items-center gap-2`}>
                <FiCircle className="w-2 h-2" /> <span>Teacher Attendance</span>
              </NavLink>
              <NavLink to="/admin/subject-assignments" className={`${dropdownItem} flex items-center gap-2`}>
                <FiCircle className="w-2 h-2" /> <span>Subject Assignments</span>
              </NavLink>
              <NavLink to="/admin/class-teachers" className={`${dropdownItem} flex items-center gap-2`}>
                <FiCircle className="w-2 h-2" /> <span>Class Teachers</span>
              </NavLink>
            </>
          )}
        </details>

        {/* Finance */}
        <details className="group">
          <summary className={`${linkClass} flex items-center gap-3 cursor-pointer list-none`}>
            <span>💰</span>
            {!collapsed && <span className="flex-1">Finance</span>}
            {!collapsed && <FiChevronRight className="transition-transform group-open:rotate-90" />}
          </summary>

          {!collapsed && (
            <>
              <NavLink to="/admin/fees-structures" className={`${dropdownItem} flex items-center gap-2`}>
                <FiCircle className="w-2 h-2" /> <span>Fees Structures</span>
              </NavLink>
              <NavLink to="/admin/payments" className={`${dropdownItem} flex items-center gap-2`}>
                <FiCircle className="w-2 h-2" /> <span>Payments</span>
              </NavLink>
              <NavLink to="/admin/finance/student-fees" className={`${dropdownItem} flex items-center gap-2`}>
                <FiCircle className="w-2 h-2" /> <span>Student Fees</span>
              </NavLink>
              <NavLink to="/admin/finance/student-balances" className={`${dropdownItem} flex items-center gap-2`}>
                <FiCircle className="w-2 h-2" /> <span>Student Balances</span>
              </NavLink>
              <NavLink to="/admin/finance/finance-overview" className={`${dropdownItem} flex items-center gap-2`}>
                <FiCircle className="w-2 h-2" /> <span>Finance Overview</span>
              </NavLink>
            </>
          )}
        </details>

        {/* Grades */}
        <details className="group">
          <summary className={`${linkClass} flex items-center gap-3 cursor-pointer list-none`}>
            <span>🏫</span>
            {!collapsed && <span className="flex-1">Grades</span>}
            {!collapsed && <FiChevronRight className="transition-transform group-open:rotate-90" />}
          </summary>
          {!collapsed && (
            <>
              <NavLink to="/admin/grades" className={`${dropdownItem} flex items-center gap-2`}>
                <FiCircle className="w-2 h-2" /> <span>Grades</span>
              </NavLink>
              <NavLink to="/admin/streams" className={`${dropdownItem} flex items-center gap-2`}>
                <FiCircle className="w-2 h-2" /> <span>Streams</span>
              </NavLink>
              <NavLink to="/admin/subjects-per-grade" className={`${dropdownItem} flex items-center gap-2`}>
                <FiCircle className="w-2 h-2" /> <span>Subject Per Grade</span>
              </NavLink>
            </>
          )}
        </details>

        {/* Timetable */}
        <NavLink to="/admin/timetable" className={`${linkClass} flex items-center gap-3`}>
          <span>🗓️</span>
          {!collapsed && <span>Timetable</span>}
        </NavLink>

        {/* Reports */}
        <details className="group">
          <summary className={`${linkClass} flex items-center gap-3 cursor-pointer list-none`}>
            <span>📊</span>
            {!collapsed && <span className="flex-1">Reports</span>}
            {!collapsed && <FiChevronRight className="transition-transform group-open:rotate-90" />}
          </summary>

          {!collapsed && (
            <>
              <NavLink to="/admin/reports/academic" className={`${dropdownItem} flex items-center gap-2`}>
                <FiCircle className="w-2 h-2" /> <span>Academic</span>
              </NavLink>
              <NavLink to="/admin/reports/financial" className={`${dropdownItem} flex items-center gap-2`}>
                <FiCircle className="w-2 h-2" /> <span>Financial</span>
              </NavLink>
              <NavLink to="/admin/reports/attendance" className={`${dropdownItem} flex items-center gap-2`}>
                <FiCircle className="w-2 h-2" /> <span>Attendance</span>
              </NavLink>
            </>
          )}
        </details>

        {/* Calendar */}
        <NavLink to="/admin/calendar" className={`${linkClass} flex items-center gap-3`}>
          <span>🗓️</span>
          {!collapsed && <span>Calendar</span>}
        </NavLink>

        {/* Reports */}
        <details className="group">
          <summary className={`${linkClass} flex items-center gap-3 cursor-pointer list-none`}>
            <span>🏆</span>
            {!collapsed && <span className="flex-1">Results</span>}
            {!collapsed && <FiChevronRight className="transition-transform group-open:rotate-90" />}
          </summary>
          <NavLink to="/admin/EnterResults" className={dropdownItem}>Enter Results</NavLink>
          <NavLink to="/admin/StudentResults" className={dropdownItem}>Student Results</NavLink>
          <NavLink to="/admin/results/TermLock" className={dropdownItem}>Term Lock Status</NavLink>

          {!collapsed && (
            <>
              <NavLink to="/admin/EnterResults" className={`${dropdownItem} flex items-center gap-2`}>
                <FiCircle className="w-2 h-2" /> <span>Enter Results</span>
              </NavLink>
              <NavLink to="/admin/StudentResults" className={`${dropdownItem} flex items-center gap-2`}>
                <FiCircle className="w-2 h-2" /> <span>Student Results</span>
              </NavLink>
              <NavLink to="/admin/results/TermLock" className={`${dropdownItem} flex items-center gap-2`}>
                <FiCircle className="w-2 h-2" /> <span>Term Lock Status</span>
              </NavLink>
              <NavLink to="/admin/results/grade-scale" className={`${dropdownItem} flex items-center gap-2`}>
                <FiCircle className="w-2 h-2" /> <span>Grade Scale</span>
              </NavLink>
            </>
          )}
        </details>

         {/* Reports */}
        <details className="group">
          <summary className={`${linkClass} flex items-center gap-3 cursor-pointer list-none`}>
            <span>✒️</span>
            {!collapsed && <span className="flex-1">Assessments</span>}
            {!collapsed && <FiChevronRight className="transition-transform group-open:rotate-90" />}
          </summary>

          {!collapsed && (
            <>
              <NavLink to="/admin/assessments/exams" className={`${dropdownItem} flex items-center gap-2`}>
                <FiCircle className="w-2 h-2" /> <span>Exams</span>
              </NavLink>
              <NavLink to="/admin/assessments/records" className={`${dropdownItem} flex items-center gap-2`}>
                <FiCircle className="w-2 h-2" /> <span>Records</span>
              </NavLink>
            </>
          )}
        </details>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-blue-600">
        <NavLink
          to="/logout"
          className="block px-4 py-2 text-sm rounded text-gray-800 hover:bg-red-600 hover:text-white text-center"
        >
          <span>⬅️</span>
          {!collapsed && "Logout"}
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
