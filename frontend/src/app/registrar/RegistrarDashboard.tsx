import DashboardCard from "@/app/registrar/DashboardCard";
import TopBar from "../../components/admin/TopBar";

const cards = [
  { title: "Classes", count: 28, route: "/admin/students", icon: "🏫" },
  { title: "Students", count: 320, route: "/admin/classes", icon: "👨‍🎓" },
  { title: "Grades", route: "/admin/timetable", icon: "⭐" },
  { title: "Teacher Attendance", route: "/admin/grades", icon: "👨‍🏫" },
  { title: "Academic Calendar", route: "/admin/calendar", icon: "🗓️" },
  { title: "Reports", route: "/admin/reports", icon: "📊" },
  { title: "Notes", route: "/admin/finance", icon: "📝" },
];

const RegistrarDashboard = () => {
  return (
    <div className="space-y-6">
      <TopBar />

      <h1 className="text-2xl font-semibold">System Overview</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <DashboardCard
            key={card.title}
            title={card.title}
            count={card.count}
            route={card.route}
            icon={card.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default RegistrarDashboard;
