import React, { useState, useRef } from 'react';
import { X, Upload, Calendar, Save } from 'lucide-react';
import type {
  Exam,
  ExamType,
  Term,
  SchoolClass,
  Subject,
  AcademicYear,
} from '@/types/assessment';


interface EditExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
  id: number,
  examData: {
    name?: string;
    exam_date?: string;
    total_marks?: number;
    }
  ) => Promise<boolean>;
  exam: Exam;
  examTypes: ExamType[];

  // optional, but correctly typed
  terms?: Term[];
  classes?: SchoolClass[];
  subjects?: Subject[];
  academicYears?: AcademicYear[];
}



const EditExamModal: React.FC<EditExamModalProps> = ({
  isOpen,
  onClose,
  onSave,
  exam,
  examTypes,
  subjects = [],
  terms = [],
  classes = [],
  academicYears = [],
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: exam.name,
    exam_type_id: exam.exam_type_id,
    term_id: exam.term_id,
    class_id: exam.class_id,
    subject_id: exam.subject_id,
    academic_year_id: exam.academic_year_id,
    exam_date: exam.exam_date,
    total_marks: exam.total_marks,
  });

  const [errors] = useState<{ exam_date?: string }>({});

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (errors.exam_date) {
      alert('Please fix date errors before saving');
      return;
    }

    await onSave(exam.id, {
      name: formData.name,
      exam_date: formData.exam_date,
      total_marks: formData.total_marks,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="bg-blue-600 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Save size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Edit Exam</h3>
                <p className="text-blue-100 text-sm">
                  Update assessment details
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-blue-700 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X size={18} className="text-white" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label
              htmlFor="edit-exam-name"
              className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700"
            >
              <Calendar size={14} className="text-blue-600" />
              Exam Name *
            </label>
            <input
              id="edit-exam-name"
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Exam Type *
              </label>
              <select
                value={formData.exam_type_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    exam_type_id: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg"
              >
                {examTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Term *
              </label>
              <select
                value={formData.term_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    term_id: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg"
              >
                {terms.map((term) => (
                  <option key={term.id} value={term.id}>
                    {term.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Class *
              </label>
              <select
                value={formData.class_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    class_id: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Subject *
              </label>
              <select
                value={formData.subject_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subject_id: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg"
              >
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Academic Year *
              </label>
              <select
                value={formData.academic_year_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    academic_year_id: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg"
              >
                {academicYears.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Total Marks *
              </label>
              <input
                type="number"
                min={1}
                required
                value={formData.total_marks}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    total_marks: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Exam Date *
            </label>
            <input
              type="date"
              required
              value={formData.exam_date}
              onChange={(e) =>
                setFormData({ ...formData, exam_date: e.target.value })
              }
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
              <Upload size={14} />
              Attach File (Optional)
            </label>
            <button
              type="button"
              onClick={triggerFileInput}
              className="w-full px-3 py-2.5 border-2 border-dashed border-gray-300 rounded-lg"
            >
              Click to upload
            </button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExamModal;
