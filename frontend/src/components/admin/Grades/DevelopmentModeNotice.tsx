// components/admin/Grades/DevelopmentModeNotice.tsx
interface DevelopmentModeNoticeProps {
  gradesCount: number;
  subjectsCount: number;
}

const DevelopmentModeNotice = ({ gradesCount, subjectsCount }: DevelopmentModeNoticeProps) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className="text-yellow-600">🚧</div>
        <div>
          <p className="font-medium text-yellow-800">Development Mode</p>
          <p className="text-sm text-yellow-700">
            Using demo data. {gradesCount} grades and {subjectsCount} subjects loaded.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentModeNotice;