"use client";

interface Props {
  subject: string;
  teacher?: string | null;
  room?: string | null;
}

const TimetableCell = ({ subject, teacher, room }: Props) => {
  const hasMeta = teacher || room;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center text-center">
      {/* Subject */}
      <div className="font-bold uppercase text-gray-800">
        {subject}
      </div>

      {/* Teacher & Room (optional) */}
      {hasMeta && (
        <div className="mt-1 text-xs text-gray-500 space-y-0.5">
          {teacher && <div>{teacher}</div>}
          {room && <div>Room {room}</div>}
        </div>
      )}
    </div>
  );
};

export default TimetableCell;
