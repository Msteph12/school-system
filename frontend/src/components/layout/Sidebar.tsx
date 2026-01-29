import { useState } from "react";
import { NavLink } from "react-router-dom";
import { NavLink,  useNavigate } from "react-router-dom";
import { FiChevronRight, FiCircle } from "react-icons/fi";
import { authService } from "@/services/auth";
import { useAuth } from "@/context/useAuth";

const Sidebar = ({ collapsed = false }: { collapsed?: boolean }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const linkClass =
    "flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-white/20 hover:shadow-sm";

  const dropdownItem =
    "flex items-center gap-2 px-4 py-2 ml-8 text-sm text-gray-800 hover:text-blue-700 hover:bg-white/30 transition-colors duration-200 rounded-md";

  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const isDropdownOpen = (dropdownName: string) => {
    return openDropdown === dropdownName;
  };

  const handleDropdownLinkClick = (dropdownName: string) => {
    // Keep the current dropdown open when clicking items inside it
    setOpenDropdown(dropdownName);
  };

  const handleRegularLinkClick = () => {
    // Close all dropdowns when clicking regular (non-dropdown) links
    setOpenDropdown(null);
  };
  const navigate = useNavigate();
  const { setUser } = useAuth();

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-64"
      } bg-blue-300 text-gray-800 flex flex-col transition-all duration-300 shadow-lg backdrop-blur-sm bg-opacity-90`}
    >
      {/* Header */}
      <div className="px-4 py-5 font-bold text-gray-900 text-lg border-b border-white/30 bg-linear-to-r from-white/10 to-transparent text-center">
        {!collapsed && (
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>School Admin</span>
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          </div>
        )}
        {collapsed && <div className="text-center text-lg">⚙️</div>}
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto 
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-track]:bg-white/10
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-white/30
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:hover:bg-white/40
        scrollbar-width: thin
        scrollbar-color: rgba(255,255,255,0.3) rgba(255,255,255,0.1)">
        <NavLink 
          to="/admin" 
          end
          className={({ isActive }) => 
            `${linkClass} ${isActive ? 'bg-white/25 text-gray-900 shadow-inner font-semibold' : 'text-gray-700'}`
          }
          onClick={handleRegularLinkClick}
        >
          <div className="w-6 h-6 flex items-center justify-center rounded-md bg-white/30 backdrop-blur-sm">
            <span className="text-base">🏠</span>
          </div>
          {!collapsed && <span>System Overview</span>}
        </NavLink>

        {/* Students */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("students")}
            className={`${linkClass} cursor-pointer text-gray-700 hover:bg-white/20 w-full text-left`}
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-md bg-white/30 backdrop-blur-sm">
              <span className="text-base">📚</span>
            </div>
            {!collapsed && <span className="flex-1">Students</span>}
            {!collapsed && (
              <FiChevronRight 
                className={`text-gray-600 transition-transform duration-300 ${isDropdownOpen("students") ? "rotate-90" : ""}`} 
              />
            )}
          </button>

          {!collapsed && isDropdownOpen("students") && (
            <div className="space-y-1 border-l border-white/30 ml-2 pl-3 mt-1">
              <NavLink 
                to="/admin/students" 
                className={({ isActive }) => 
                  `${dropdownItem} ${isActive ? 'text-blue-700 bg-white/40 font-medium' : ''}`
                }
                onClick={() => handleDropdownLinkClick("students")}
              >
                <FiCircle className="w-1.5 h-1.5 text-blue-500" /> <span>All Students</span>
              </NavLink>
              <NavLink 
                to="/admin/students-promotion" 
                className={({ isActive }) => 
                  `${dropdownItem} ${isActive ? 'text-blue-700 bg-white/40 font-medium' : ''}`
                }
                onClick={() => handleDropdownLinkClick("students")}
              >
                <FiCircle className="w-1.5 h-1.5 text-blue-500" /> <span>Student Promotion</span>
              </NavLink>
              <NavLink 
                to="/admin/students-promotion/history" 
                className={({ isActive }) => 
                  `${dropdownItem} ${isActive ? 'text-blue-700 bg-white/40 font-medium' : ''}`
                }
                onClick={() => handleDropdownLinkClick("students")}
              >
                <FiCircle className="w-1.5 h-1.5 text-blue-500" /> <span>Promotion History</span>
              </NavLink>
              <NavLink 
                to="/admin/student-attendance" 
                className={({ isActive }) => 
                  `${dropdownItem} ${isActive ? 'text-blue-700 bg-white/40 font-medium' : ''}`
                }
                onClick={() => handleDropdownLinkClick("students")}
              >
                <FiCircle className="w-1.5 h-1.5 text-blue-500" /> <span>Student Attendance</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Teachers */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("teachers")}
            className={`${linkClass} cursor-pointer text-gray-700 hover:bg-white/20 w-full text-left`}
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-md bg-white/30 backdrop-blur-sm">
              <span className="text-base">👤</span>
            </div>
            {!collapsed && <span className="flex-1">Teachers</span>}
            {!collapsed && (
              <FiChevronRight 
                className={`text-gray-600 transition-transform duration-300 ${isDropdownOpen("teachers") ? "rotate-90" : ""}`} 
              />
            )}
          </button>

          {!collapsed && isDropdownOpen("teachers") && (
            <div className="space-y-1 border-l border-white/30 ml-2 pl-3 mt-1">
              <NavLink 
                to="/admin/teachers" 
                className={({ isActive }) => 
                  `${dropdownItem} ${isActive ? 'text-blue-700 bg-white/40 font-medium' : ''}`
                }
                onClick={() => handleDropdownLinkClick("teachers")}
              >
                <FiCircle className="w-1.5 h-1.5 text-blue-500" /> <span>All Teachers</span>
              </NavLink>
              <NavLink 
                to="/admin/teachers-attendance" 
                className={({ isActive }) => 
                  `${dropdownItem} ${isActive ? 'text-blue-700 bg-white/40 font-medium' : ''}`
                }
                onClick={() => handleDropdownLinkClick("teachers")}
              >
                <FiCircle className="w-1.5 h-1.5 text-blue-500" /> <span>Teacher Attendance</span>
              </NavLink>
              <NavLink 
                to="/admin/subject-assignments" 
                className={({ isActive }) => 
                  `${dropdownItem} ${isActive ? 'text-blue-700 bg-white/40 font-medium' : ''}`
                }
                onClick={() => handleDropdownLinkClick("teachers")}
              >
                <FiCircle className="w-1.5 h-1.5 text-blue-500" /> <span>Subject Assignments</span>
              </NavLink>
              <NavLink 
                to="/admin/class-teachers" 
                className={({ isActive }) => 
                  `${dropdownItem} ${isActive ? 'text-blue-700 bg-white/40 font-medium' : ''}`
                }
                onClick={() => handleDropdownLinkClick("teachers")}
              >
                <FiCircle className="w-1.5 h-1.5 text-blue-500" /> <span>Class Teachers</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Finance */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("finance")}
            className={`${linkClass} cursor-pointer text-gray-700 hover:bg-white/20 w-full text-left`}
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-md bg-white/30 backdrop-blur-sm">
              <span className="text-base">💰</span>
            </div>
            {!collapsed && <span className="flex-1">Finance</span>}
            {!collapsed && (
              <FiChevronRight 
                className={`text-gray-600 transition-transform duration-300 ${isDropdownOpen("finance") ? "rotate-90" : ""}`} 
              />
            )}
          </button>

          {!collapsed && isDropdownOpen("finance") && (
            <div className="space-y-1 border-l border-white/30 ml-2 pl-3 mt-1">
              <NavLink 
                to="finance" 
                className={({ isActive }) => 
                  `${dropdownItem} ${isActive ? 'text-blue-700 bg-white/40 font-medium' : ''}`
                }
                onClick={() => handleDropdownLinkClick("finance")}
              >
                <FiCircle className="w-1.5 h-1.5 text-blue-500" /> <span>Fees Structures</span>
              </NavLink>
              <NavLink 
                to="/admin/payments" 
                className={({ isActive }) => 
                  `${dropdownItem} ${isActive ? 'text-blue-700 bg-white/40 font-medium' : ''}`
                }
                onClick={() => handleDropdownLinkClick("finance")}
              >
                <FiCircle className="w-1.5 h-1.5 text-blue-500" /> <span>Payments</span>
              </NavLink>
              <NavLink 
                to="/admin/finance/student-fees" 
                className={({ isActive }) => 
                  `${dropdownItem} ${isActive ? 'text-blue-700 bg-white/40 font-medium' : ''}`
                }
                onClick={() => handleDropdownLinkClick("finance")}
              >
                <FiCircle className="w-1.5 h-1.5 text-blue-500" /> <span>Student Fees</span>
              </NavLink>
              <NavLink 
                to="/admin/finance/student-balances" 
                className={({ isActive }) => 
                  `${dropdownItem} ${isActive ? 'text-blue-700 bg-white/40 font-medium' : ''}`
                }
                onClick={() => handleDropdownLinkClick("finance")}
              >
                <FiCircle className="w-1.5 h-1.5 text-blue-500" /> <span>Student Balances</span>
              </NavLink>
              <NavLink 
                to="/admin/finance/finance-overview" 
                className={({ isActive }) => 
                  `${dropdownItem} ${isActive ? 'text-blue-700 bg-white/40 font-medium' : ''}`
                }
                onClick={() => handleDropdownLinkClick("finance")}
              >
                <FiCircle className="w-1.5 h-1.5 text-blue-500" /> <span>Finance Overview</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Grades */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("grades")}
            className={`${linkClass} cursor-pointer text-gray-700 hover:bg-white/20 w-full text-left`}
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-md bg-white/30 backdrop-blur-sm">
              <span className="text-base">🏫</span>
            </div>
            {!collapsed && <span className="flex-1">Grades</span>}
            {!collapsed && (
              <FiChevronRight 
                className={`text-gray-600 transition-transform duration-300 ${isDropdownOpen("grades") ? "rotate-90" : ""}`} 
              />
            )}
          </button>

          {!collapsed && isDropdownOpen("grades") && (
            <div className="space-y-1 border-l border-white/30 ml-2 pl-3 mt-1">
              <NavLink 
                to="/admin/grades" 
                className={({ isActive }) => 
                  `${dropdownItem} ${isActive ? 'text-blue-700 bg-white/40 font-medium' : ''}`
                }
                onClick={() => handleDropdownLinkClick("grades")}
              >
                <FiCircle className="w-1.5 h-1.5 text-blue-500" /> <span>Grades</span>
              </NavLink>
              <NavLink 
                to="/admin/classes" 
                className={({ isActive }) => 
                  `${dropdownItem} ${isActive ? 'text-blue-700 bg-white/40 font-medium' : ''}`
                }
                onClick={() => handleDropdownLinkClick("grades")}
              >
                <FiCircle className="w-1.5 h-1.5 text-blue-500" /> <span>Classes</span>
              </NavLink>
              <NavLink 
                to="/admin/subjects-per-grade" 
                className={({ isActive }) => 
                  `${dropdownItem} ${isActive ? 'text-blue-700 bg-white/40 font-medium' : ''}`
                }
                onClick={() => handleDropdownLinkClick("grades")}
              >
                <FiCircle className="w-1.5 h-1.5 text-blue-500" /> <span>Subject Per Grade</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Timetable */}
        <NavLink 
          to="/admin/timetable" 
          className={({ isActive }) => 
            `${linkClass} ${isActive ? 'bg-white/25 text-gray-900 shadow-inner font-semibold' : 'text-gray-700'}`
          }
          onClick={handleRegularLinkClick}
        >
          <div className="w-6 h-6 flex items-center justify-center rounded-md bg-white/30 backdrop-blur-sm">
            <span className="text-base">🗓️</span>
          </div>
          {!collapsed && <span>Timetable</span>}
        </NavLink>

        {/* Reports */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("reports")}
            className={`${linkClass} cursor-pointer text-gray-700 hover:bg-white/20 w-full text-left`}
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-md bg-white/30 backdrop-blur-sm">
              <span className="text-base">📊</span>
            </div>
            {!collapsed && <span className="flex-1">Reports</span>}
            {!collapsed && (
              <FiChevronRight 
                className={`text-gray-600 transition-transform duration-300 ${isDropdownOpen("reports") ? "rotate-90" : ""}`} 
              />
            )}
          </button>

          {!collapsed && isDropdownOpen("reports") && (
            <div className="space-y-1 border-l border-white/30 ml-2 pl-3 mt-1">
              <NavLink 
                to="/admin/reports/academic" 
                className={({ isActive }) => 
                  `${dropdownItem} ${isActive ? 'text-blue-700 bg-white/40 font-medium' : ''}`
                }
                onClick={() => handleDropdownLinkClick("reports")}
              >
                <FiCircle className="w-1.5 h-1.5 text-blue-500" /> <span>Academic</span>
              </NavLink>
              <NavLink 
                to="/admin/reports/financial" 
                className={({ isActive }) => 
                  `${dropdownItem} ${isActive ? 'text-blue-700 bg-white/40 font-medium' : ''}`
                }
                onClick={() => handleDropdownLinkClick("reports")}
              >
                <FiCircle className="w-1.5 h-1.5 text-blue-500" /> <span>Financial</span>
              </NavLink>
              <NavLink 
                to="/admin/reports/attendance" 
                className={({ isActive }) => 
                  `${dropdownItem} ${isActive ? 'text-blue-700 bg-white/40 font-medium' : ''}`
                }
                onClick={() => handleDropdownLinkClick("reports")}
              >
                <FiCircle className="w-1.5 h-1.5 text-blue-500" /> <span>Attendance</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Calendar */}
        <NavLink 
          to="/admin/calendar" 
          className={({ isActive }) => 
            `${linkClass} ${isActive ? 'bg-white/25 text-gray-900 shadow-inner font-semibold' : 'text-gray-700'}`
          }
          onClick={handleRegularLinkClick}
        >
          <div className="w-6 h-6 flex items-center justify-center rounded-md bg-white/30 backdrop-blur-sm">
            <span className="text-base">🗓️</span>
          </div>
          {!collapsed && <span>Calendar</span>}
        </NavLink>

        {/* Results */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("results")}
            className={`${linkClass} cursor-pointer text-gray-700 hover:bg-white/20 w-full text-left`}
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-md bg-white/30 backdrop-blur-sm">
              <span className="text-base">🏆</span>
            </div>
            {!collapsed && <span className="flex-1">Results</span>}
            {!collapsed && (
              <FiChevronRight 
                className={`text-gray-600 transition-transform duration-300 ${isDropdownOpen("results") ? "rotate-90" : ""}`} 
              />
            )}
          </button>

          {!collapsed && isDropdownOpen("results") && (
            <div className="space-y-1 border-l border-white/30 ml-2 pl-3 mt-1">
              <NavLink 
                to="/admin/EnterResults" 
                className={({ isActive }) => 
                  `${dropdownItem} ${isActive ? 'text-blue-700 bg-white/40 font-medium' : ''}`
                }
                onClick={() => handleDropdownLinkClick("results")}
              >
                <FiCircle className="w-1.5 h-1.5 text-blue-500" /> <span>Enter Results</span>
              </NavLink>
              <NavLink 
                to="/admin/StudentResults" 
                className={({ isActive }) => 
                  `${dropdownItem} ${isActive ? 'text-blue-700 bg-white/40 font-medium' : ''}`
                }
                onClick={() => handleDropdownLinkClick("results")}
              >
                <FiCircle className="w-1.5 h-1.5 text-blue-500" /> <span>Student Results</span>
              </NavLink>
              <NavLink 
                to="/admin/TermLock" 
                className={({ isActive }) => 
                  `${dropdownItem} ${isActive ? 'text-blue-700 bg-white/40 font-medium' : ''}`
                }
                onClick={() => handleDropdownLinkClick("results")}
              >
                <FiCircle className="w-1.5 h-1.5 text-blue-500" /> <span>Term Lock Status</span>
              </NavLink>
              <NavLink 
                to="/admin/GradeScalePage" 
                className={({ isActive }) => 
                  `${dropdownItem} ${isActive ? 'text-blue-700 bg-white/40 font-medium' : ''}`
                }
                onClick={() => handleDropdownLinkClick("results")}
              >
                <FiCircle className="w-1.5 h-1.5 text-blue-500" /> <span>Grade Scale</span>
              </NavLink>
            </div>
          )}
        </div>

         {/* Assessments */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("assessments")}
            className={`${linkClass} cursor-pointer text-gray-700 hover:bg-white/20 w-full text-left`}
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-md bg-white/30 backdrop-blur-sm">
              <span className="text-base">✒️</span>
            </div>
            {!collapsed && <span className="flex-1">Assessments</span>}
            {!collapsed && (
              <FiChevronRight 
                className={`text-gray-600 transition-transform duration-300 ${isDropdownOpen("assessments") ? "rotate-90" : ""}`} 
              />
            )}
          </button>

          {!collapsed && isDropdownOpen("assessments") && (
            <div className="space-y-1 border-l border-white/30 ml-2 pl-3 mt-1">
              <NavLink 
                to="/admin/AssessmentsPage" 
                className={({ isActive }) => 
                  `${dropdownItem} ${isActive ? 'text-blue-700 bg-white/40 font-medium' : ''}`
                }
                onClick={() => handleDropdownLinkClick("assessments")}
              >
                <FiCircle className="w-1.5 h-1.5 text-blue-500" /> <span>Exams</span>
              </NavLink>
              <NavLink 
                to="/admin/exam-timetable" 
                className={({ isActive }) => 
                  `${dropdownItem} ${isActive ? 'text-blue-700 bg-white/40 font-medium' : ''}`
                }
                onClick={() => handleDropdownLinkClick("assessments")}
              >
                <FiCircle className="w-1.5 h-1.5 text-blue-500" /> <span>Exam Timetable</span>
              </NavLink>
            </div>
          )}
        </div>
        </details>

        {/* Academic Setup */}
        <NavLink 
          to="/admin/academicsetup" 
          className={({ isActive }) => 
            `${linkClass} ${isActive ? 'bg-white/25 text-gray-900 shadow-inner font-semibold' : 'text-gray-700'}`
          }
        >
          <div className="w-6 h-6 flex items-center justify-center rounded-md bg-white/30 backdrop-blur-sm">
            <span className="text-base">🧭</span>
          </div>
          {!collapsed && <span>Academic Setup</span>}
        </NavLink>
        
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/30 mt-auto">
        <NavLink
          to="/logout"
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg 
            ${isActive ? 'bg-red-50/30 text-red-700 shadow-inner' : 'text-gray-600 hover:bg-red-50/40 hover:text-red-600'}`
          }
          onClick={handleRegularLinkClick}
        <button
          onClick={async () => {
            try {
              await authService.logout(); // backend token revoke
            } catch {
              // ignore — user may already be logged out
            } finally {
              authService.logout(); // clear token + header
              setUser(null);
              navigate("/login");
            }
          }}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium
            text-gray-600 hover:bg-red-50/40 hover:text-red-600
            transition-all duration-200 rounded-lg"
        >
          <div className="w-6 h-6 flex items-center justify-center rounded-md bg-white/20 backdrop-blur-sm">
            <span className="text-base">⬅️</span>
          </div>
          {!collapsed && <span className="flex-1 text-left">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;