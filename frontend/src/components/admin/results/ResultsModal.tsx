import React, { useState } from 'react';
import type { Student, GradeScale } from '@/types/result';

interface ResultsModalProps {
  students: Student[];
  gradeScales: GradeScale[];
  onSave: (data: {
    studentId: string;
    marks: number;
    gradeScaleId: string;
    remarks?: string;
  }) => void;
  onClose: () => void;
}

const ResultsModal: React.FC<ResultsModalProps> = ({
  students,
  gradeScales,
  onSave,
  onClose,
}) => {
  const [studentId, setStudentId] = useState('');
  const [marks, setMarks] = useState('');
  const [gradeScaleId, setGradeScaleId] = useState('');
  const [remarks, setRemarks] = useState('');

  const handleSubmit = () => {
    if (!studentId || !marks || !gradeScaleId) {
      alert("Please fill all required fields");
      return;
    }

    const marksNum = parseInt(marks);
    if (isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
      alert("Please enter valid marks (0-100)");
      return;
    }

    onSave({
      studentId,
      marks: marksNum,
      gradeScaleId,
      remarks: remarks || undefined,
    });
  };

  // Find grade scale based on marks
  const getGradeScaleForMarks = (marksValue: string) => {
    const marksNum = parseInt(marksValue);
    if (isNaN(marksNum)) return '';
    
    const scale = gradeScales.find(s => marksNum >= s.min_score && marksNum <= s.max_score);
    return scale?.id || '';
  };

  const handleMarksChange = (value: string) => {
    setMarks(value);
    const scaleId = getGradeScaleForMarks(value);
    if (scaleId) setGradeScaleId(scaleId);
  };

  const selectedStudent = students.find(s => s.id === studentId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Result</h3>
        
        <div className="space-y-4">
          {/* Student Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Student *
            </label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              aria-label="Select Student"
            >
              <option value="">Choose a student</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.admission_no} - {student.name}
                </option>
              ))}
            </select>
          </div>

          {/* Marks Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marks (0-100) *
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={marks}
              onChange={(e) => handleMarksChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter marks"
            />
          </div>

          {/* Grade Scale */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade Scale *
            </label>
            <select
              value={gradeScaleId}
              onChange={(e) => setGradeScaleId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              aria-label="Grade Scale"
            >
              <option value="">Select grade scale</option>
              {gradeScales.map(scale => (
                <option key={scale.id} value={scale.id}>
                  {scale.grade} ({scale.min_score}-{scale.max_score})
                </option>
              ))}
            </select>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks (Optional)
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              rows={3}
              placeholder="Enter any remarks"
            />
          </div>

          {selectedStudent && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Student:</strong> {selectedStudent.name}<br />
                <strong>Admission No:</strong> {selectedStudent.admission_no}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Save Result
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsModal;