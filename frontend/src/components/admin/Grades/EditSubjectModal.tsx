// components/admin/Grades/EditSubjectModal.tsx
import { useState } from "react";
import type { Grade } from "@/types/grade";
import type { Subject } from "@/types/subject";

interface EditSubjectModalProps {
  subject: Subject;
  grades: Grade[];
  onClose: () => void;
  onSave: (updatedData: Partial<Subject>) => Promise<void>;
}

const EditSubjectModal = ({ subject, grades, onClose, onSave }: EditSubjectModalProps) => {
  const [formData, setFormData] = useState({
    name: subject.name,
    code: subject.code || "",
    grade_id: subject.grade_id,
    status: subject.status
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error("Subject name is required");
      }
      if (!formData.code.trim()) {
        throw new Error("Subject code is required");
      }
      if (!formData.grade_id) {
        throw new Error("Please select a grade");
      }

      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update subject");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Edit Subject</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="subject-name" className="block text-sm font-medium text-gray-700 mb-1">
                Subject Name *
              </label>
              <input
                id="subject-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading}
                aria-required="true"
                aria-label="Subject name"
                placeholder="Enter subject name"
              />
            </div>

            <div>
              <label htmlFor="subject-code" className="block text-sm font-medium text-gray-700 mb-1">
                Subject Code *
              </label>
              <input
                id="subject-code"
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading}
                aria-required="true"
                aria-label="Subject code"
                placeholder="Enter subject code (e.g., MATH)"
              />
            </div>

            <div>
              <label htmlFor="subject-grade" className="block text-sm font-medium text-gray-700 mb-1">
                Grade *
              </label>
              <select
                id="subject-grade"
                name="grade_id"
                value={formData.grade_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading}
                aria-required="true"
                aria-label="Select grade"
              >
                <option value="">Select a grade</option>
                {grades.map(grade => (
                  <option key={grade.id} value={grade.id}>
                    {grade.name} ({grade.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="subject-status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="subject-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
                aria-label="Select subject status"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              disabled={loading}
              aria-label="Cancel editing"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
              aria-label="Save subject changes"
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSubjectModal;