"use client";

interface EventPillProps {
  title: string;
  type?: "exam" | "meeting" | "holiday" | "general";
}

const typeStyles: Record<string, string> = {
  exam: "bg-red-100 text-red-700",
  meeting: "bg-blue-100 text-blue-700",
  holiday: "bg-green-100 text-green-700",
  general: "bg-gray-100 text-gray-700",
};

const EventPill = ({ title, type = "general" }: EventPillProps) => {
  return (
    <div
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
