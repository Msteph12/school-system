import { useNavigate } from "react-router-dom";

interface Props {
  title: string;
  count?: number;
  route?: string;
  icon: string;
}

const DashboardCard = ({ title, count, route, icon }: Props) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => route && navigate(route)}
      className="bg-white p-4 rounded shadow-md shadow-red-200 cursor-pointer hover:scale-105 transition min-h-30 flex flex-col justify-center">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <h2 className="text-base font-medium text-gray-600">{title}</h2>
      </div>

      {count !== undefined && (
        <p className="text-2xl font-bold text-blue-700 mt-3 ml-9">
          {count}
        </p>
      )}
    </div>
  );
};

export default DashboardCard;
