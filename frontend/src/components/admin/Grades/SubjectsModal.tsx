"use client";

import { useState } from "react";
import api from "@/services/api";
import type { Grade } from "@/types/grade";
import type { Subject } from "@/types/subject";

interface SubjectsModalProps {
  onClose: () => void;
  onSubjectAdded: (subject: Subject) => void;
  grades: Grade[];
}

interface SubjectFormData {
  grade_id: string;
  name: string;
  code?: string;
  status: "Active" | "Inactive";
}

const SubjectsModal = ({ onClose, onSubjectAdded, grades }: SubjectsModalProps) => {
  const [subjects, setSubjects] = useState<SubjectFormData[]>([
    { grade_id: "", name: "", code: "", status: "Active" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: number]: { [key: string]: string } }>({});


  // Validate all subjects
  const validateAllSubjects = () => {
    const allErrors: { [key: number]: { [key: string]: string } } = {};
    let isValid = true;

    subjects.forEach((subject, index) => {
      const subjectErrors: { [key: string]: string } = {};
      
      if (!subject.grade_id.trim()) {
        subjectErrors.grade_id = "Please select a grade";
        isValid = false;
      }

      if (!subject.name.trim()) {
        subjectErrors.name = "Subject name is required";
        isValid = false;
      }

      if (subject.name.trim().length < 2) {
        subjectErrors.name = "Subject name must be at least 2 characters";
        isValid = false;
      }

      if (Object.keys(subjectErrors).length > 0) {
        allErrors[index] = subjectErrors;
      }
    });

    setErrors(allErrors);
    return isValid;
  };

  // Handle input change for a subject
  const handleSubjectChange = (index: number, field: keyof SubjectFormData, value: string) => {
    setSubjects(prev => {
      const newSubjects = [...prev];
      newSubjects[index] = { ...newSubjects[index], [field]: value };
      return newSubjects;
    });

    // Clear error for this field
    if (errors[index]?.[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        if (newErrors[index]) {
          delete newErrors[index][field];
          if (Object.keys(newErrors[index]).length === 0) {
            delete newErrors[index];
          }
        }
        return newErrors;
      });
    }
  };

  // Add a new empty subject row
  const addSubjectRow = () => {
    setSubjects(prev => [
      ...prev,
      { grade_id: "", name: "", code: "", status: "Active" }
    ]);
  };

  // Remove a subject row
  const removeSubjectRow = (index: number) => {
    if (subjects.length > 1) {
      setSubjects(prev => prev.filter((_, i) => i !== index));
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[index];
        return newErrors;
      });
    }
  };

  // Save all subjects
  const handleSaveSubjects = async () => {
    if (!validateAllSubjects()) {
      return;
    }

    setIsLoading(true);
    try {
      const savedSubjects: Subject[] = [];

      // Save each subject individually
      for (const subject of subjects) {
        try {
          const response = await api.post("/subjects", {
            ...subject,
            is_active: subject.status === "Active",
          });
          
          savedSubjects.push(response.data);
          onSubjectAdded(response.data);
        } catch (error) {
          console.error("Error saving subject:", error, subject);
          // Continue saving other subjects even if one fails
        }
      }

      // Reset form if all saved successfully
      if (savedSubjects.length > 0) {
        setSubjects([{ grade_id: "", name: "", code: "", status: "Active" }]);
        setErrors({});
        
        if (savedSubjects.length === subjects.length) {
          alert(`Successfully saved ${savedSubjects.length} subject(s)`);
          onClose();
        } else {
          alert(`Saved ${savedSubjects.length} out of ${subjects.length} subjects`);
        }
      }
    } catch (error) {
      console.error("Error saving subjects:", error);
      alert("Failed to save subjects. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSubjects([{ grade_id: "", name: "", code: "", status: "Active" }]);
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Add Multiple Subjects</h2>
          <button 
            onClick={handleCancel} 
            className="text-gray-500 hover:text-gray-700 text-lg"
            disabled={isLoading}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <p className="text-sm text-blue-800">
            You can add multiple subjects at once. Each subject will be assigned to the selected grade.
          </p>
        </div>

        {/* Subjects Table */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Subjects to Add</h3>
            <button
              type="button"
              onClick={addSubjectRow}
              className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200"
              disabled={isLoading}
            >
              + Add Row
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left p-3 text-sm font-medium text-gray-700">#</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Grade *</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Subject Name *</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Subject Code</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-600">{index + 1}</td>
                    
                    {/* Grade Selection */}
                    <td className="p-3">
                      <select
                        className={`w-full border rounded px-3 py-2 text-sm ${
                          errors[index]?.grade_id ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={subject.grade_id}
                        onChange={(e) => handleSubjectChange(index, 'grade_id', e.target.value)}
                        disabled={isLoading}
                        aria-label="Select Grade"
                      >
                        <option value="">Select Grade</option>
                        {grades
                          .filter(grade => grade.status === "Active")
                          .map((grade) => (
                            <option key={grade.id} value={grade.id}>
                              {grade.name} ({grade.code})
                            </option>
                          ))}
                      </select>
                      {errors[index]?.grade_id && (
                        <p className="text-red-500 text-xs mt-1">{errors[index].grade_id}</p>
                      )}
                    </td>
                    
                    {/* Subject Name */}
                    <td className="p-3">
                      <input
                        type="text"
                        className={`w-full border rounded px-3 py-2 text-sm ${
                          errors[index]?.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., Mathematics, English"
                        value={subject.name}
                        onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                        disabled={isLoading}
                      />
                      {errors[index]?.name && (
                        <p className="text-red-500 text-xs mt-1">{errors[index].name}</p>
                      )}
                    </td>
                    
                    {/* Subject Code */}
                    <td className="p-3">
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        placeholder="e.g., MATH, ENG"
                        value={subject.code || ''}
                        onChange={(e) => handleSubjectChange(index, 'code', e.target.value)}
                        disabled={isLoading}
                      />
                    </td>
                    
                    {/* Status */}
                    <td className="p-3">
                      <select
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        value={subject.status}
                        onChange={(e) => handleSubjectChange(index, 'status', e.target.value)}
                        disabled={isLoading}
                        aria-label="Select Status"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </td>
                    
                    {/* Action */}
                    <td className="p-3">
                      {subjects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSubjectRow(index)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
                          disabled={isLoading}
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveSubjects}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Saving...
              </>
            ) : (
              `Save ${subjects.length} Subject${subjects.length > 1 ? 's' : ''}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectsModal;