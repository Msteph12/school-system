import { useNavigate } from "react-router-dom";

interface Props {
  title: string;
  count?: number | string;
  subtitle?: string;
  route?: string;
  icon: string;
}

const DashboardCard = ({ title, count, subtitle, route, icon }: Props) => {
  const navigate = useNavigate();

  // Map specific titles to icon color categories for subtle differentiation
  const getIconCategory = (title: string) => {
    const peopleCards = ["Students", "Teachers"];
    const academicCards = ["Grades", "Assessments", "Results", "EnterResults"];
    const systemCards = ["Timetable", "Reports", "Finance"];
    const dataCards = ["Assessments", "Reports", "Results"];
    
    if (peopleCards.includes(title)) return "people";
    if (academicCards.includes(title)) return "academic";
    if (systemCards.includes(title)) return "system";
    if (dataCards.includes(title)) return "data";
    return "neutral";
  };

  const iconCategory = getIconCategory(title);
  
  // Define color classes based on category
  const getCategoryColors = () => {
    switch (iconCategory) {
      case "people":
        return {
          iconBg: "bg-gradient-to-br from-blue-50 to-blue-100",
          iconBorder: "border-blue-200/60",
          iconGlow: "bg-blue-400/20",
          accent: "from-blue-400/20 to-blue-600/20",
          countColor: "text-blue-700",
          accentLine: "from-blue-300 to-blue-400"
        };
      case "academic":
        return {
          iconBg: "bg-gradient-to-br from-emerald-50 to-emerald-100",
          iconBorder: "border-emerald-200/60",
          iconGlow: "bg-emerald-400/20",
          accent: "from-emerald-400/20 to-emerald-600/20",
          countColor: "text-emerald-700",
          accentLine: "from-emerald-300 to-emerald-400"
        };
      case "system":
        return {
          iconBg: "bg-gradient-to-br from-violet-50 to-violet-100",
          iconBorder: "border-violet-200/60",
          iconGlow: "bg-violet-400/20",
          accent: "from-violet-400/20 to-violet-600/20",
          countColor: "text-violet-700",
          accentLine: "from-violet-300 to-violet-400"
        };
      case "data":
        return {
          iconBg: "bg-gradient-to-br from-amber-50 to-amber-100",
          iconBorder: "border-amber-200/60",
          iconGlow: "bg-amber-400/20",
          accent: "from-amber-400/20 to-amber-600/20",
          countColor: "text-amber-700",
          accentLine: "from-amber-300 to-amber-400"
        };
      default:
        return {
          iconBg: "bg-gradient-to-br from-gray-50 to-gray-100",
          iconBorder: "border-gray-200/60",
          iconGlow: "bg-gray-400/20",
          accent: "from-gray-400/20 to-gray-600/20",
          countColor: "text-gray-700",
          accentLine: "from-gray-300 to-gray-400"
        };
    }
  };

  const colors = getCategoryColors();

  const handleClick = () => {
    if (route) {
      navigate(route);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative group h-full min-h-40 ${route ? "cursor-pointer" : "cursor-default"}`}
    >
      {/* Outer glow on hover */}
      {route && (
        <div 
          className={`absolute -inset-0.5 bg-gradient-to-r ${colors.accent} rounded-xl blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300`}
        />
      )}
      
      {/* Main card container */}
        <div className={`relative h-full bg-[#f2e1df]/90 backdrop-blur-sm  rounded-xl p-4 
        ${route ? "hover:bg-[#F5EFEE]/95 hover:shadow-lg transition-all duration-300 group-hover:translate-y-0.5" : ""}
        transition-all duration-300`}
        >
        {/* Icon with subtle glow */}
        <div className="relative mb-6">
          {route && (
            <div className={`absolute -inset-2 ${colors.iconGlow} rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          )}
          <div className={`relative w-12 h-12 flex items-center justify-center ${colors.iconBg} ${colors.iconBorder} rounded-xl shadow-sm 
            ${route ? "transition-transform duration-300 group-hover:scale-105" : ""}`}
          >
            <span className="text-xl">{icon}</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-bold text-gray-800 tracking-tight line-clamp-2">
              {title}
            </h2>
            {count !== undefined && (
              <div className="flex-shrink-0">
                <div className={`text-2xl font-bold ${colors.countColor} tracking-tight`}>
                  {count}
                </div>
              </div>
            )}
          </div>
          
          {subtitle && (
            <p className="text-sm text-gray-500/80 mt-1">{subtitle}</p>
          )}
          
          {/* Subtle accent line */}
          <div className={`w-12 h-1 bg-gradient-to-r ${colors.accentLine} rounded-full opacity-60 
            ${route ? "group-hover:opacity-80 transition-opacity duration-300" : ""}`} 
          />
          
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;