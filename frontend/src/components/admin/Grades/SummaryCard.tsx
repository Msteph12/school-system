// components/admin/Grades/SummaryCard.tsx
interface SummaryCardProps {
  title: string;
  value: number;
  description: string;
  gradient: "red" | "green" | "blue";
}

const SummaryCard = ({ title, value, description, gradient }: SummaryCardProps) => {
  const gradientClass = {
    red: "from-red-600/80 to-red-400/80",
    green: "from-green-600/80 to-green-400/80",
    blue: "from-blue-600/80 to-blue-400/80"
  }[gradient];

  return (
    <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`} />
      <div className="relative h-full p-5 flex flex-col justify-end text-white">
        <p className="text-sm opacity-90">{title}</p>
        <h2 className="text-2xl font-bold mt-1">{value}</h2>
        <p className="text-xs opacity-80 mt-1">{description}</p>
      </div>
    </div>
  );
};

export default SummaryCard;