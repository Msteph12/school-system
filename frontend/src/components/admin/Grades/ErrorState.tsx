// components/admin/Grades/ErrorState.tsx
interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  onUseDemoData: () => void;
}

const ErrorState = ({ error, onRetry, onUseDemoData }: ErrorStateProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center py-8">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Connection Issue</h3>
        <p className="text-gray-600 mb-4">
          Could not connect to the backend API. Please check your connection and try again.
        </p>
        <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
          <span className="font-medium">Error Details:</span> {error}
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onRetry}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            Retry Connection
          </button>
          <button
            onClick={onUseDemoData}
            className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium shadow-sm"
          >
            Continue with Demo Data
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-4">
          Note: Demo data is for development purposes only
        </p>
      </div>
    </div>
  );
};

export default ErrorState;