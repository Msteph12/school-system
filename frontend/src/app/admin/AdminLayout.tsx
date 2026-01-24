import Sidebar from "../../components/layout/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

const AdminLayout = () => {
  const location = useLocation();

  const isCalendarPage = location.pathname === "/admin/calendar";

  return (
    <div className="flex h-screen bg-red-50">
      <Sidebar collapsed={isCalendarPage} />

      <Toaster />

      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
