// components/admin/Grades/QuickActions.tsx
interface QuickActionsProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
}

const QuickActions = ({ title, description, buttonText, onButtonClick }: QuickActionsProps) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
        <button
          onClick={onButtonClick}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
        >
          <span className="text-xl">+</span>
          <span>{buttonText}</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;