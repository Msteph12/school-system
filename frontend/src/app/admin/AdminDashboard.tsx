import DashboardCard from "./DashboardCard";
import TopBar from "../../components/admin/TopBar";
import { useNavigate } from "react-router-dom"; 
import StickyNotes from "../../components/admin/StickyNotes";
import { useEffect, useState } from "react"; // Add useState for calendar navigation
import { dashboardService } from "@/services/dashboard";

const AdminDashboard = () => {
  const navigate = useNavigate(); // Initialize navigate

  const [search, setSearch] = useState("");

  const [stats, setStats] = useState({
  students: 0,
  teachers: 0,
  grades: 0,
  studentsWithBalances: 0,
  timetable: { published: 0, total: 0 },
  teacherAttendance: { present: 0, total: 0 },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
  dashboardService
    .getStats()
    .then(setStats)
    .catch(() => {
      // keep safe defaults (0)
    })
    .finally(() => setLoading(false));
  }, []);

  // State for calendar navigation
  const [calendarView, setCalendarView] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth()
  });

  // Today's date for highlighting
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDate = today.getDate();
  // Removed unused currentDay variable

  // Get days in month for the viewed calendar
  const daysInMonth = new Date(calendarView.year, calendarView.month + 1, 0).getDate();
  
  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(calendarView.year, calendarView.month, 1).getDay();
  
  // Create array of days
  const days = [];
  
  // Add empty cells for days before the first day of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  
  // Add all days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Day names for header
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Handle calendar cell click
  const handleCalendarClick = (day: number | null) => {
    if (day !== null) {
      // Navigate to Calendar page with the selected date
      navigate('/admin/calendar');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <TopBar
          searchValue={search}
          onSearchChange={setSearch}
        />
        
        {/* Welcome Section Skeleton */}
        <div className="animate-pulse">
          <div className="bg-gray-200 rounded-lg h-32 mb-4"></div>
          
          {/* System Overview Skeleton */}
          <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
          
          {/* Main Content Skeleton */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              {/* Core Management Skeleton */}
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
                ))}
              </div>
              
              {/* Operations Skeleton */}
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-gray-200 rounded-lg h-24"></div>
                ))}
              </div>
            </div>
            
            {/* Right Column Skeleton */}
            <div className="space-y-4">
              <div className="bg-gray-200 rounded-lg h-64"></div>
              <div className="bg-gray-200 rounded-lg h-48"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Navigation functions
  const goToPreviousMonth = () => {
    setCalendarView(prev => {
      let newMonth = prev.month - 1;
      let newYear = prev.year;
      
      if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
      }
      
      return { year: newYear, month: newMonth };
    });
  };

  const goToNextMonth = () => {
    setCalendarView(prev => {
      let newMonth = prev.month + 1;
      let newYear = prev.year;
      
      if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
      }
      
      return { year: newYear, month: newMonth };
    });
  };

  const goToToday = () => {
    setCalendarView({
      year: currentYear,
      month: currentMonth
    });
  };

  // Check if a day is today
  const isToday = (day: number | null) => {
    return day === currentDate && 
           calendarView.year === currentYear && 
           calendarView.month === currentMonth;
  };

  return (
    <div className="space-y-4">
      <TopBar
        searchValue={search}
        onSearchChange={setSearch}
      />

      {/* Welcome Back Section - Updated with gradient */}
      <div className="relative rounded-lg overflow-hidden shadow-lg">
        {/* Gradient background using your three core colors */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#e33a24]/40 via-[#4d9ef7]/40 to-slate-900/40"></div>
        {/* Subtle overlay pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #FFD1C9 2px, transparent 2px)`,
          backgroundSize: '30px 30px'
        }}></div>
        
        <div className="relative p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back, Administrator</h1>
              <p className="text-gray-600 mb-4">Have a Good day at work</p>
            </div>
            
            {/* Date indicator */}
            <div className="text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-pink-600"></div>
                    <span className="text-xs text-gray-600">Today</span>
                  </div>
                  <div className="text-sm font-medium text-gray-800">
                    {today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Overview Section - Enhanced to match premium feel */}
      <div className="relative rounded-lg overflow-hidden shadow-lg">
        {/* Gradient background matching the Welcome section */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#e33a24]/40 via-[#4d9ef7]/40 to-blue-800/40"></div>
        
        {/* Subtle overlay pattern */}
        <div className="absolute inset-0 opacity-3" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #FFD1C9 2px, transparent 2px)`,
          backgroundSize: '30px 30px'
        }}></div>
        
        <div className="relative p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Student Balances - Financial & Important */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/30 to-blue-600/30 rounded-xl blur-sm opacity-0 group-hover:opacity-70 transition-all duration-300"></div>
              <div className="relative bg-white/80 backdrop-blur-sm border border-blue-100/50 rounded-xl p-4 hover:bg-white/90 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-blue-400/20 rounded-full blur-sm"></div>
                    <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-full border border-blue-200/50 shadow-sm">
                      <span className="text-lg">💰</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700 text-sm tracking-wide">Student with Balances</h3>
                    <div className="w-16 h-1 bg-gradient-to-r from-blue-300 to-blue-400 rounded-full mt-1"></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-800 tracking-tight">
                     {stats.studentsWithBalances.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500/80">Total students</p>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                      <span className="text-xs font-medium text-amber-600">Attention</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timetable Published - Progressive & Positive */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400/30 to-emerald-600/30 rounded-xl blur-sm opacity-0 group-hover:opacity-70 transition-all duration-300"></div>
              <div className="relative bg-white/80 backdrop-blur-sm border border-emerald-100/50 rounded-xl p-4 hover:bg-white/90 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-emerald-400/20 rounded-full blur-sm"></div>
                    <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-full border border-emerald-200/50 shadow-sm">
                      <span className="text-lg">📅</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700 text-sm tracking-wide">Timetable Published</h3>
                    <div className="w-16 h-1 bg-gradient-to-r from-emerald-300 to-emerald-400 rounded-full mt-1"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-2xl font-bold text-gray-800 tracking-tight">
                      {stats.timetable.published}<span className="text-lg font-normal text-gray-500">/{stats.timetable.total}</span>
                    </p>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200/50 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${(stats.timetable.published / stats.timetable.total) * 100 || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-emerald-600 font-medium">
                    {Math.round((stats.timetable.published / stats.timetable.total) * 100)}% complete
                  </p>
                </div>
              </div>
            </div>

            {/* Teacher Attendance - Stable & Operational */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-400/30 to-violet-600/30 rounded-xl blur-sm opacity-0 group-hover:opacity-70 transition-all duration-300"></div>
              <div className="relative bg-white/80 backdrop-blur-sm border border-violet-100/50 rounded-xl p-4 hover:bg-white/90 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-violet-400/20 rounded-full blur-sm"></div>
                    <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-violet-50 to-violet-100 rounded-full border border-violet-200/50 shadow-sm">
                      <span className="text-lg">👤</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700 text-sm tracking-wide">Teacher Attendance</h3>
                    <div className="w-16 h-1 bg-gradient-to-r from-violet-300 to-violet-400 rounded-full mt-1"></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-800 tracking-tight">
                    {stats.teacherAttendance.present}  <span>/{stats.teacherAttendance.total}</span>
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1.5">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-200 to-violet-300 border border-white shadow-sm"></div>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500/80">Active now</span>
                    </div>
                    <div className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-1 rounded-full">
                      {Math.round((stats.teacherAttendance.present / stats.teacherAttendance.total) * 100)}% present
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Left Column - Main Grids */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tier 1 - Primary Admin Actions (Larger, More Prominent) */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Core Management</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Students Card - Primary */}
              <div className="col-span-2 md:col-span-1">
                <DashboardCard
                  title="Students"
                  count={stats.students}
                  route="/admin/students"
                  icon="👨‍🎓"
                  subtitle="Manage student records & profiles"
                />
              </div>
              
              {/* Teachers Card - Primary */}
              <div className="col-span-2 md:col-span-1">
                <DashboardCard
                  title="Teachers"
                  count={stats.teachers}
                  route="/admin/teachers"
                  icon="👤"
                  subtitle="View teacher schedules & details"
                />
              </div>
              
              {/* Finance Card - Primary */}
              <div className="col-span-2 md:col-span-1">
                <DashboardCard
                  title="Finance"
                  route="/admin/finance"
                  icon="💰"
                  subtitle="Financial reports & fee management"
                />
              </div>
              
              {/* Grades Card - Primary */}
              <div className="col-span-2 md:col-span-1">
                <DashboardCard
                  title="Grades"
                  count={stats.grades}
                  route="/admin/grades"
                  icon="🏫"
                  subtitle="Academic performance tracking"
                />
              </div>
            </div>
          </div>

          {/* Tier 2 - Supporting & Operational Actions (Compact, Secondary) */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Operations & Reporting</h3>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              {/* Timetable - Supporting */}
              <DashboardCard
                title="Timetable"
                route="/admin/timetable"
                icon="📅"
                subtitle="Schedule management"
              />
              
              {/* Assessments - Supporting */}
              <DashboardCard
                title="Assessments"
                route="/admin/assessments"
                icon="✒️"
                subtitle="Exams & evaluations"
              />
              
              {/* Reports - Supporting */}
              <DashboardCard
                title="Reports"
                route="/admin/reports"
                icon="📊"
                subtitle="Analytics & insights"
              />
              
              {/* Results - Supporting */}
              <DashboardCard
                title="Results"
                route="/admin/EnterResults"
                icon="🏆"
                subtitle="Academic results entry"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Calendar, Events, Notes */}
        <div className="space-y-4">
          {/* Calendar Card - Updated with gradient background */}
          <div className="relative rounded-lg overflow-hidden shadow-lg">
            {/* Gradient background using your three core colors */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#e33a24]/20 via-[#9CCBFF]/20 to-blue-800/20"></div>
            
            {/* Subtle overlay pattern */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #FFD1C9 2px, transparent 2px)`,
              backgroundSize: '30px 30px'
            }}></div>
            
            <div className="relative p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-semibold text-gray-800">Calendar</h3>
                <button 
                  onClick={() => navigate('/admin/calendar')}
                  className="text-sm text-slate-800 font-medium hover:text-pink-600 transition-colors duration-150 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full"
                >
                  View Full Calendar 
                </button>
              </div>
              
              {/* Mini Calendar */}
              <div className="mb-3">
                {/* Calendar Navigation */}
                <div className="flex justify-between items-center mb-2">
                  <button 
                    onClick={goToPreviousMonth}
                    className="w-6 h-6 flex items-center justify-center hover:bg-white/80 hover:text-pink-600 rounded-full transition-colors duration-150 bg-white/60"
                  >
                    &lt;
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-gray-800 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full">
                      {monthNames[calendarView.month]} {calendarView.year}
                    </h4>
                    {(calendarView.year !== currentYear || calendarView.month !== currentMonth) && (
                      <button 
                        onClick={goToToday}
                        className="text-xs px-2 py-1 bg-white/80 text-pink-600 font-medium hover:bg-white rounded-full transition-colors duration-150 backdrop-blur-sm"
                      >
                        Today
                      </button>
                    )}
                  </div>
                  
                  <button 
                    onClick={goToNextMonth}
                    className="w-6 h-6 flex items-center justify-center hover:bg-white/80 hover:text-pink-600 rounded-full transition-colors duration-150 bg-white/60"
                  >
                    &gt;
                  </button>
                </div>
                
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {dayNames.map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-black-600 py-1 bg-white/50 backdrop-blur-sm rounded-full">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1 p-1 bg-white/30 backdrop-blur-sm rounded-lg shadow-red-300"> 
                  {days.map((day, index) => (
                    <div 
                      key={index}
                      onClick={() => handleCalendarClick(day)}
                      className={`
                        h-8 flex items-center justify-center text-sm cursor-pointer rounded
                        ${day === null ? 'invisible' : ''}
                        ${isToday(day) ? 
                          'bg-pink-100 text-pink-600 font-bold rounded-full border border-pink-200' : 
                          'hover:bg-white/80 backdrop-blur-sm rounded'
                        }
                        ${day !== null ? 'hover:bg-white/80 hover:shadow-sm' : ''}
                        transition-colors duration-150
                      `}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow-md shadow-red-200 p-3">
            <StickyNotes />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;