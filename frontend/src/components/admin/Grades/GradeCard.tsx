// components/admin/Grades/GradeCard.tsx
import type { Grade } from "@/types/grade";
import type { Subject } from "@/types/subject";

interface GradeCardProps {
  grade: Grade;
  subjects: Subject[];
  onClick: (grade: Grade) => void;
}

const GradeCard = ({ grade, subjects, onClick }: GradeCardProps) => {
  const gradientClass = getGradientClass(grade.status);
  const gradeSubjects = subjects.filter(s => s.grade_id === String(grade.id));
  
  return (
    <div
      onClick={() => onClick(grade)}
      className="relative h-64 rounded-2xl overflow-hidden shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl group"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`} />

      <div className="relative h-full p-6 flex flex-col justify-between text-white">
        {/* Top Section - Grade Details */}
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold mb-1">{grade.name}</h3>
              <p className="text-sm opacity-90">Code: {grade.code}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
              grade.status === "Active" 
                ? "bg-white/20 backdrop-blur-sm" 
                : "bg-black/20 backdrop-blur-sm"
            }`}>
              {grade.status}
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm opacity-90">Classes:</span>
              <span className="font-semibold">{grade.classCount || 0}</span>
            </div>
          </div>
        </div>

        {/* Middle Section - Subjects Count */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="text-sm opacity-90">Subjects Assigned</p>
              <h4 className="text-2xl font-bold">{gradeSubjects.length}</h4>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Subject Preview */}
        <div className="pt-4 border-t border-white/20">
          <p className="text-sm opacity-90 mb-2">Subjects:</p>
          {gradeSubjects.length > 0 ? (
            <div className="space-y-1">
              {gradeSubjects.slice(0, 3).map((subject) => (
                <div key={subject.id} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/60"></div>
                  <span className="text-sm truncate">{subject.name}</span>
                </div>
              ))}
              {gradeSubjects.length > 3 && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-white/40"></div>
                  <span className="text-xs opacity-80">
                    +{gradeSubjects.length - 3} more subjects
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm opacity-80 italic">No subjects assigned yet</p>
          )}
          <p className="text-xs opacity-80 mt-3 text-center">
            Click to view all subjects →
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper function to determine gradient class based on grade status
const getGradientClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "from-blue-600/90 to-blue-500/90";
    case "inactive":
      return "from-gray-600/90 to-gray-500/90";
    default:
      return "from-purple-600/90 to-purple-500/90";
  }
};

export default GradeCard;