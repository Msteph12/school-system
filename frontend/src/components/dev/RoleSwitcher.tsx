import { useAuth } from "@/context/useAuth";
import type { UserRole } from "@/context/AuthContext";

export default function RoleSwitcher() {
  const { user, setUser } = useAuth();

  if (!user) return null;

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value as UserRole;
    setUser({ ...user, role });
  };

  return (
    <div className="fixed bottom-4 right-4 p-2 bg-gray-800 text-white rounded shadow-lg z-50">
      <label className="block mb-1 text-xs">Dev Role:</label>
      <select
        value={user.role ?? ""}
        onChange={handleRoleChange}
        className="w-full p-1 bg-gray-900 text-white border border-gray-700 rounded text-xs"
        aria-label="Development role selector"
        title="Switch user roles for testing"
      >
        <option value="admin">Admin</option>
        <option value="registrar">Registrar</option>
        <option value="teacher">Teacher</option>
        <option value="accountant">Accountant</option>
      </select>
    </div>
  );
}