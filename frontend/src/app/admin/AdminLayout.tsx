import Sidebar from "../../components/layout/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { Bell } from "lucide-react";

import logo from "@/assets/logo.jpg";

const AdminLayout = () => {
  const location = useLocation();
  const isCalendarPage = location.pathname === "/admin/calendar";

  return (
    <div className="flex h-screen bg-red-50 relative">
      <Sidebar collapsed={isCalendarPage} />

      <Toaster />

      {/* Logo Background - Centered and very visible */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-40">
          <img
            src={logo}
            alt="School System Background"
            className="w-[900px] h-[900px] max-w-[95vw] max-h-[95vh] object-contain"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col relative z-10">
        {/* Header Container */}
        <div className="bg-slate-900 px-6 py-3 w-full">
          <div className="flex items-center justify-between">
            <h1 className="text-white text-l font-semibold">
              Administration Dashboard
            </h1>
            <div className="flex items-center">
              <button 
                className="p-2 hover:bg-slate-800 rounded-full transition-colors"
                aria-label="Notifications"
                title="View notifications"
              >
                <Bell className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;