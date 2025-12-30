import DashboardCard from "./DashboardCard";
import TopBar from "../../components/admin/TopBar";

const cards = [
  { title: "Students", count: 320, route: "/admin/students", icon: "👨‍🎓" },
  { title: "Teachers", count: 28, route: "/admin/teachers", icon: "👤" },
  { title: "Finance", route: "/admin/finance", icon: "💰" },
  { title: "Grades", route: "/admin/grades", icon: "🏫" },
  { title: "Timetable", route: "/admin/timetable", icon: "📅" },
  { title: "Reports", route: "/admin/reports", icon: "📊" },
  { title: "Calendar", route: "/admin/calendar", icon: "🗓️" },
  { title: "Results", route: "/admin/results", icon: "🏆" },
  { title: "Assessments", route: "/admin/assessments", icon: "✒️" },
  { title: "Notes", route: "/admin/notes", icon: "📝" },
];

const AdminDashboard = () => {
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

export default AdminDashboard;
