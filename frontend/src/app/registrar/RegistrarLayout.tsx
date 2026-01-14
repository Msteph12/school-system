import RegistrarSidebar from "../../components/layout/RegistrarSidebar";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const RegistrarLayout = () => {
  return (
    <div className="flex h-screen bg-red-50">
      <RegistrarSidebar />
      <Toaster position="top-right" />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default RegistrarLayout;
