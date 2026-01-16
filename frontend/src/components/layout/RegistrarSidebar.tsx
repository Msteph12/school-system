import { NavLink } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { FiCircle } from "react-icons/fi";

const RegistrarSidebar = () => {
  const linkClass =
    "block px-4 py-2 text-sm rounded hover:bg-blue-600 hover:text-white";

  const dropdownItem =
    "block px-4 py-1 ml-8 text-sm text-gray-700 hover:text-blue-600";

  return (
    <aside className="w-64 bg-blue-300 text-white flex flex-col">
      <div className="px-4 py-4 font-bold text-black text-lg border-b border-blue-600">
        Registrar Portal
      </div>

      <nav className="flex-1 p-3 space-y-1">
        <NavLink to="/registrar" end className={linkClass}>
          Dashboard
        </NavLink>

        {/* Classes */}
        <details className="group">
          <summary className={`${linkClass} flex items-center gap-3 cursor-pointer list-none`}>
            <span>🏫</span>
            <span className="flex-1">Classes</span>
            <FiChevronRight className="transition-transform group-open:rotate-90" />
          </summary>
          <NavLink to="/registrar/classes" className={`${dropdownItem} flex items-center gap-2`}>
            <FiCircle className="w-2 h-2" />
            <span>All Classes</span>
          </NavLink>
          <NavLink to="/registrar/classes/create" className={`${dropdownItem} flex items-center gap-2`}>
            <FiCircle className="w-2 h-2" />
            <span>All Grades</span>
          </NavLink>
        </details>

        {/* Students */}
        <details className="group">
          <summary className={`${linkClass} flex items-center gap-3 cursor-pointer list-none`}>
            <span>📚</span>
            <span className="flex-1">Students</span>
            <FiChevronRight className="transition-transform group-open:rotate-90" />
          </summary>
          <NavLink to="/registrar/students" className={`${dropdownItem} flex items-center gap-2`}>
            <FiCircle className="w-2 h-2" />
            <span>All Students</span>
          </NavLink>
          <NavLink to="/registrar/students/register" className={`${dropdownItem} flex items-center gap-2`}>
            <FiCircle className="w-2 h-2" />
            <span>Register Student</span>
          </NavLink>
          <NavLink to="/registrar/students/transfer" className={`${dropdownItem} flex items-center gap-2`}>
            <FiCircle className="w-2 h-2" />
            <span>Transfer Students</span>
          </NavLink>
          <NavLink to="/registrar/students/enrollment" className={`${dropdownItem} flex items-center gap-2`}>
            <FiCircle className="w-2 h-2" />
            <span>Enrollment Status</span>
          </NavLink>
        </details>

        {/* Grades */}
        <details className="group">
          <summary className={`${linkClass} flex items-center gap-3 cursor-pointer list-none`}>
            <span>⭐</span>
            <span className="flex-1">Grades</span>
            <FiChevronRight className="transition-transform group-open:rotate-90" />
          </summary>
          <NavLink to="/registrar/grades/manage" className={`${dropdownItem} flex items-center gap-2`}>
            <FiCircle className="w-2 h-2" />
            <span>All Grades</span>
          </NavLink>
          <NavLink to="/registrar/grades/transcripts" className={`${dropdownItem} flex items-center gap-2`}>
            <FiCircle className="w-2 h-2" />
            <span>Classes/Streams</span>
          </NavLink>
        </details>

        {/* Teacher Attendance */}
        <NavLink 
          to="/registrar/teacher-attendance" 
          className={`${linkClass} flex items-center gap-3`}
        >
          <span>👨‍🏫</span>
          <span>Teacher Attendance</span>
        </NavLink>

        {/* Academic Calendar */}
        <NavLink 
          to="/registrar/calendar" 
          className={`${linkClass} flex items-center gap-3`}
        >
          <span>🗓️</span>
          <span>Academic Calendar</span>
        </NavLink>

        {/* Reports */}
        <NavLink 
          to="/registrar/reports" 
          className={`${linkClass} flex items-center gap-3`}
        >
          <span>📊</span>
          <span>Reports</span>
        </NavLink>

        {/* Notes */}
        <NavLink 
          to="/registrar/notes" 
          className={`${linkClass} flex items-center gap-3`}
        >
          <span>📝</span>
          <span>Notes</span>
        </NavLink>

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

export default RegistrarSidebar;