"use client";

import { useState, useEffect } from "react";

interface GradeScale {
  id: string;
  name: string;
  min_score: number;
  max_score: number;
}

interface Student {
  admission_no: string;
  name: string;
  grade_id: string;
  class_id: string;
}

interface ResultData {
  id?: string;
  admission_no: string;
  student_name: string;
  subject: string;
  marks: number;
  grade_scale: string;
  remarks: string;
}

interface ResultsModalProps {
  onClose: () => void;
  onResultAdded: (result: ResultData) => void;
  onResultUpdated?: (result: ResultData) => void;
  gradeScale: GradeScale[];
  currentSubject: string;
  selectedGrade: string;
  selectedClass: string;
  students: Student[];
  editingResult?: ResultData | null;
}

const ResultsModal = ({ 
  onClose, 
  onResultAdded, 
  onResultUpdated,
  gradeScale, 
  currentSubject,
  selectedGrade,
  selectedClass,
  students,
  editingResult 
}: ResultsModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    admission_no: "",
    student_name: "",
    marks: "",
    grade_scale: "",
    remarks: "",
  });

  // Initialize form with editing data if provided
  useEffect(() => {
    if (editingResult) {
      setFormData({
        admission_no: editingResult.admission_no,
        student_name: editingResult.student_name,
        marks: editingResult.marks.toString(),
        grade_scale: editingResult.grade_scale,
        remarks: editingResult.remarks || "",
      });
    } else {
      setFormData({
        admission_no: "",
        student_name: "",
        marks: "",
        grade_scale: "",
        remarks: "",
      });
    }
  }, [editingResult]);

  // Find student when admission number changes
  useEffect(() => {
    if (formData.admission_no.trim()) {
      // Filter students based on selected grade and class
      const filteredStudents = students.filter(student => 
        student.grade_id === selectedGrade && student.class_id === selectedClass
      );
      
      const student = filteredStudents.find(s => 
        s.admission_no.toLowerCase() === formData.admission_no.toLowerCase()
      );
      
      if (student) {
        setFormData(prev => ({
          ...prev,
          student_name: student.name
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          student_name: "Student not found in selected class"
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, student_name: "" }));
    }
  }, [formData.admission_no, students, selectedGrade, selectedClass]);

  // Calculate grade when marks change
  useEffect(() => {
    if (formData.marks) {
      const marksNum = parseFloat(formData.marks);
      if (!isNaN(marksNum)) {
        const grade = gradeScale.find(
          g => marksNum >= g.min_score && marksNum <= g.max_score
        );
        if (grade) {
          setFormData(prev => ({
            ...prev,
            grade_scale: grade.name
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            grade_scale: ""
          }));
        }
      }
    }
  }, [formData.marks, gradeScale]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.admission_no.trim()) {
      newErrors.admission_no = "Admission number is required";
    }

    if (!formData.student_name || formData.student_name === "Student not found in selected class") {
      newErrors.admission_no = "Invalid admission number for selected class";
    }

    if (!formData.marks.trim()) {
      newErrors.marks = "Marks are required";
    } else {
      const marksNum = parseFloat(formData.marks);
      if (isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
        newErrors.marks = "Marks must be between 0 and 100";
      }
    }

    if (!formData.grade_scale) {
      newErrors.marks = "Marks do not match any grade scale";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare result data
      const resultData: ResultData = {
        id: editingResult?.id,
        admission_no: formData.admission_no,
        student_name: formData.student_name,
        subject: currentSubject,
        marks: parseFloat(formData.marks),
        grade_scale: formData.grade_scale,
        remarks: formData.remarks,
      };

      if (editingResult && onResultUpdated) {
        // Update existing result
        onResultUpdated(resultData);
      } else {
        // Add new result
        onResultAdded(resultData);
      }

      // Reset form
      setFormData({
        admission_no: "",
        student_name: "",
        marks: "",
        grade_scale: "",
        remarks: "",
      });

      onClose();
    } catch (error) {
      console.error("Error saving result:", error);
      alert("Failed to save result. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {editingResult ? "Edit Result" : "Enter Results"}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 text-lg"
            disabled={isLoading}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Class Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Class:</span> Grade {selectedGrade}, Class {selectedClass}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Admission Number */}
          <div>
            <label htmlFor="admission_no" className="block text-sm font-medium mb-1">
              Admission Number <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  id="admission_no"
                  type="text"
                  className={`w-full border rounded px-3 py-2 ${
                    errors.admission_no ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter admission number"
                  title="Admission Number"
                  value={formData.admission_no}
                  onChange={(e) => handleInputChange('admission_no', e.target.value.toUpperCase())}
                  disabled={isLoading || !!editingResult}
                  aria-label="Admission number"
                  aria-describedby={errors.admission_no ? "admission-error" : undefined}
                />
                {errors.admission_no && (
                  <p id="admission-error" className="text-red-500 text-xs mt-1">{errors.admission_no}</p>
                )}
              </div>
              <div 
                className="w-48 px-3 py-2 bg-gray-50 rounded border border-gray-300 text-sm"
                aria-label="Student name display"
                title="Student Name"
              >
                {formData.student_name || "Student name"}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Only students in the selected class will be recognized
            </p>
          </div>

          {/* Subject (Auto-filled) */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-1">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
              value={currentSubject}
              placeholder="Selected subject"
              title="Subject"
              disabled
              readOnly
              aria-label="Subject"
            />
          </div>

          {/* Marks */}
          <div>
            <label htmlFor="marks" className="block text-sm font-medium mb-1">
              Marks (0-100) <span className="text-red-500">*</span>
            </label>
            <input
              id="marks"
              type="number"
              min="0"
              max="100"
              step="0.01"
              className={`w-full border rounded px-3 py-2 ${
                errors.marks ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter marks between 0 and 100"
              title="Marks"
              value={formData.marks}
              onChange={(e) => handleInputChange('marks', e.target.value)}
              disabled={isLoading}
              aria-label="Marks"
              aria-describedby={errors.marks ? "marks-error" : undefined}
            />
            {errors.marks && (
              <p id="marks-error" className="text-red-500 text-xs mt-1">{errors.marks}</p>
            )}
          </div>

          {/* Grade Scale (Auto-calculated) */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Grade Scale
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
              value={formData.grade_scale || ""}
              placeholder="Auto-calculated"
              title="Grade Scale"
              disabled
              readOnly
              aria-label="Grade scale"
            />
            {formData.grade_scale && (
              <p className="text-xs text-gray-500 mt-1">
                Based on grade scale configuration
              </p>
            )}
          </div>

          {/* Remarks */}
          <div>
            <label htmlFor="remarks" className="block text-sm font-medium mb-1">
              Remarks (Optional)
            </label>
            <textarea
              id="remarks"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter any remarks"
              title="Remarks"
              rows={2}
              value={formData.remarks}
              onChange={(e) => handleInputChange('remarks', e.target.value)}
              disabled={isLoading}
              aria-label="Remarks"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
              aria-label="Cancel and close modal"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isLoading}
              aria-label={editingResult ? "Update result" : "Save result"}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Saving...
                </>
              ) : editingResult ? (
                'Update Result'
              ) : (
                'Save Result'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResultsModal;