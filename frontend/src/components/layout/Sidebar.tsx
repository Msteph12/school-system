import { NavLink } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { FiCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const linkClass =
    "block px-4 py-2 text-sm rounded hover:bg-blue-600 hover:text-white";

  const dropdownItem =
    "block px-4 py-1 ml-8 text-sm text-gray-700 hover:text-blue-600";

  return (
    <aside className="w-64 bg-blue-300 text-white flex flex-col">
      <div className="px-4 py-4 font-bold text-black text-lg border-b border-blue-600">
        School Admin
      </div>

      <nav className="flex-1 p-3 space-y-1">
        <NavLink to="/admin" className={linkClass}>
          System Overview
        </NavLink>

        {/* Students */}
        <details className="group">
          <summary className={`${linkClass} flex items-center gap-3 cursor-pointer list-none`}>
            <span>📚</span>
            <span className="flex-1">Students</span>
            <FiChevronRight className="transition-transform group-open:rotate-90" />
          </summary>
         <NavLink to="/admin/students" className={`${dropdownItem} flex items-center gap-2`}><FiCircle className="w-2 h-2" /><span>All Students</span></NavLink>
         <Link to="/admin/students-promotion" className={`${dropdownItem} flex items-center gap-2`} >
          <FiCircle className="w-2 h-2" />
          <span>Student Promotion</span>
        </Link>
        <Link to="/admin/students-promotion/history" className={`${dropdownItem} flex items-center gap-2`} >
          <FiCircle className="w-2 h-2" />
          <span>Promotion History</span>
        </Link>
         <NavLink to="/admin/student-attendance" className={`${dropdownItem} flex items-center gap-2`}><FiCircle className="w-2 h-2" /><span>Student Attendance</span></NavLink>
        </details>

        {/* Teachers */}
        <details className="group">
          <summary className={`${linkClass} flex items-center gap-3 cursor-pointer list-none`}>
            <span>👤</span>
            <span className="flex-1">Teachers</span>
            <FiChevronRight className="transition-transform group-open:rotate-90" />
          </summary>
          <NavLink to="/admin/teachers" className={`${dropdownItem} flex items-center gap-2`}><FiCircle className="w-2 h-2" /><span>All Teachers</span></NavLink>
          <NavLink to="/admin/teachers-attendance" className={`${dropdownItem} flex items-center gap-2`}><FiCircle className="w-2 h-2" /><span>Teacher Attendance</span></NavLink>
          <NavLink to="/admin/subject-assignments" className={`${dropdownItem} flex items-center gap-2`}><FiCircle className="w-2 h-2" /><span>Subject Assignments</span></NavLink>
          <NavLink to="/admin/class-teachers" className={`${dropdownItem} flex items-center gap-2`}><FiCircle className="w-2 h-2" /><span>Class Teachers</span></NavLink>   
        </details>

        {/* Finance */}
        <details className="group">
          <summary className={`${linkClass} flex items-center gap-3 cursor-pointer list-none`}>
            <span>💰</span>
            <span className="flex-1">Finance</span>
            <FiChevronRight className="transition-transform group-open:rotate-90" />
          </summary>
          <NavLink to="/admin/finance" className={`${dropdownItem} flex items-center gap-2`}><FiCircle className="w-2 h-2" /><span>Fees Structure</span></NavLink>
          <NavLink to="/admin/payments" className={`${dropdownItem} flex items-center gap-2`}><FiCircle className="w-2 h-2" /><span>Payments</span></NavLink>
          <NavLink to="/admin/finance/student-fees" className={`${dropdownItem} flex items-center gap-2`}><FiCircle className="w-2 h-2" /><span>Student Fees</span></NavLink>
          <NavLink to="/admin/finance/student-balances" className={`${dropdownItem} flex items-center gap-2`}><FiCircle className="w-2 h-2" /><span>Student Balances</span></NavLink>
          <NavLink to="/admin/finance/finance-overview" className={`${dropdownItem} flex items-center gap-2`}><FiCircle className="w-2 h-2" /><span>Finance Overview</span></NavLink> 
        </details>

        {/* Grades */}
        <details className="group">
          <summary className={`${linkClass} flex items-center gap-3 cursor-pointer list-none`}>
            <span>🏫</span>
            <span className="flex-1">Grades</span>
            <FiChevronRight className="transition-transform group-open:rotate-90" />
          </summary>
          <NavLink to="/admin/grades" className={dropdownItem}>Grades</NavLink>
          <NavLink to="/admin/streams" className={dropdownItem}>Streams</NavLink>
          <NavLink to="/admin/subjects-per-grade" className={dropdownItem}>Subjects per Grade</NavLink>
          <NavLink to="/admin/class-teachers" className={dropdownItem}>Class Teachers</NavLink>
        </details>

        {/* Timetable */}
        <NavLink to="/admin/timetable" className={`${linkClass} flex items-center gap-3 cursor-pointer`}> <span>📅</span> <span>Timetable</span> </NavLink>

        {/* Reports */}
        <details className="group">
          <summary className={`${linkClass} flex items-center gap-3 cursor-pointer list-none`}>
            <span>📊</span>
            <span className="flex-1">Reports</span>
            <FiChevronRight className="transition-transform group-open:rotate-90" />
          </summary>
          <NavLink to="/admin/reports/academic" className={dropdownItem}>Academic</NavLink>
          <NavLink to="/admin/reports/financial" className={dropdownItem}>Financial</NavLink>
          <NavLink to="/admin/reports/attendance" className={dropdownItem}>Attendance</NavLink>
        </details>
        
        {/* Calendar */}
        <NavLink to="/admin/calendar" className={`${linkClass} flex items-center gap-3 cursor-pointer`}> <span>🗓️</span> <span>Calendar</span> </NavLink>

        {/* Results */}
        <details className="group">
          <summary className={`${linkClass} flex items-center gap-3 cursor-pointer list-none`}>
            <span>🏆</span>
            <span className="flex-1">Results</span>
            <FiChevronRight className="transition-transform group-open:rotate-90" />
          </summary>
          <NavLink to="/admin/EnterResults" className={dropdownItem}>Enter Results</NavLink>
          <NavLink to="/admin/results/review" className={dropdownItem}>Grade Scale</NavLink>
          <NavLink to="/admin/results/term-lock" className={dropdownItem}>Term Lock Status</NavLink>
          <NavLink to="/admin/results/student-review" className={dropdownItem}>Student Result Review</NavLink>
        </details>

        {/* Assessments */}
        <details className="group">
          <summary className={`${linkClass} flex items-center gap-3 cursor-pointer list-none`}>
            <span>✒️</span>
            <span className="flex-1">Assessments</span>
            <FiChevronRight className="transition-transform group-open:rotate-90" />
          </summary>
          <NavLink to="/admin/assessments/exams" className={dropdownItem}>Exams</NavLink>
          <NavLink to="/admin/assessments/records" className={dropdownItem}>Records</NavLink>
        </details>
      </nav>

      <div className="p-3 border-t border-blue-600">
        <NavLink
          to="/logout"
          className="block px-4 py-2 text-sm rounded text-gray-800 hover:bg-red-600 hover:text-white"
        >
          Logout
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
