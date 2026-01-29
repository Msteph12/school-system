// components/admin/Grades/LoadingState.tsx
const LoadingState = () => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-gray-200 rounded-2xl"></div>
          ))}
        </div>
        <div className="h-12 bg-gray-200 rounded w-full mt-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 bg-gray-200 rounded-2xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingState;