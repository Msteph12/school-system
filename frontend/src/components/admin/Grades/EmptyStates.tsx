// components/admin/Grades/EmptyStates.tsx
import { useNavigate } from "react-router-dom";

interface EmptyStatesProps {
  type: "grades" | "subjects";
  onAddSubject?: () => void;
}

const EmptyStates = ({ type, onAddSubject }: EmptyStatesProps) => {
  const navigate = useNavigate();

  if (type === "grades") {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
        <div className="text-gray-400 text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Grades Found</h3>
        <p className="text-gray-600 mb-6">
          You need to create grades first before assigning subjects.
        </p>
        <button
          onClick={() => navigate("/admin/grades")}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
        >
          Go to Grades Management
        </button>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="text-gray-400 text-6xl mb-4">📚</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Subjects Found</h3>
      <p className="text-gray-600 max-w-md mx-auto mb-6">
        No subjects have been created yet. Add your first subject to get started.
      </p>
      <button
        onClick={onAddSubject}
        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Add First Subject
      </button>
    </div>
  );
};

export default EmptyStates;