"use client";

interface EventPillProps {
  title: string;
  type?: "academic" | "exam" | "meeting" | "holiday" | "general";
   onClick?: () => void;
}

const typeStyles: Record<string, string> = {
  academic: "bg-purple-100 text-purple-700",
  exam: "bg-red-100 text-red-700",
  meeting: "bg-blue-100 text-blue-700",
  holiday: "bg-green-100 text-green-700",
  general: "bg-gray-300 text-gray-800",
};

const EventPill = ({ title, type = "general", onClick }: EventPillProps) => {
  return (
    <div
      onClick={onClick}
      className={`px-2 py-1 rounded text-xs truncate cursor-pointer hover:opacity-80 ${
        typeStyles[type]
      }`}
      title={title}
    >
      {title}
    </div>
  );
};

export default EventPill;
