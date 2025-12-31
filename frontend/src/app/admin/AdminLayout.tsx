import Sidebar from "../../components/layout/Sidebar";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-red-50">
      <Sidebar />
      <Toaster position="top-right" />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
