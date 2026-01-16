import { useAuth } from "@/context/useAuth";
import type { UserRole } from "@/context/AuthContext";


export default function RoleSwitcher() {
  const { user, setUser } = useAuth();

  if (!user) return null;

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value as UserRole;

    setUser({
      ...user,
      role,
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        padding: "8px 12px",
        background: "#333",
        color: "#111",
        borderRadius: 6,
        fontSize: 12,
        zIndex: 9999,
      }}
    >
      <div style={{ marginBottom: 6, color: "#fff" }}>Role:</div>
      <select value={user.role ?? ""} onChange={handleRoleChange}>
        <option value="admin">Admin</option>
        <option value="registrar">Registrar</option>
        <option value="teacher">Teacher</option>
        <option value="accountant">Accountant</option>
      </select>
    </div>
  );
}
