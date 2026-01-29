import React, { useState, useRef } from 'react';
import { X, Calendar, BookOpen, Upload, File } from 'lucide-react';
import type { ExamType, SchoolClass, Subject, AcademicYear, Term } from '@/types/assessment';

interface CreateExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (examData: {
    name: string;
    exam_type_id: number;
    class_id: number;
    subject_id: number;
    academic_year_id: number;
    term_id: number;
    exam_date: string;
    total_marks: number;
    attachment?: File;
  }) => void;
  examTypes: ExamType[];
  classes: SchoolClass[];
  subjects: Subject[];
  academicYears: AcademicYear[];
  terms: Term[];
}

const CreateExamModal: React.FC<CreateExamModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  examTypes,
  classes,
  subjects,
  academicYears,
  terms 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    exam_type_id: examTypes[0]?.id || 0,
    class_id: classes[0]?.id || 0,
    subject_id: subjects[0]?.id || 0,
    academic_year_id: academicYears.find(y => y.is_active)?.id || academicYears[0]?.id || 0,
    term_id: terms[0]?.id || 0,
    exam_date: '',
    total_marks: 100,
  });
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentName, setAttachmentName] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.exam_date || formData.total_marks <= 0) {
      alert('Please fill all required fields');
      return;
    }
    
    if (formData.exam_type_id === 0 || formData.class_id === 0 || 
        formData.subject_id === 0 || formData.academic_year_id === 0 || 
        formData.term_id === 0) {
      alert('Please select all required options');
      return;
    }
    
    const examData = {
      ...formData,
      ...(attachment && { attachment })
    };
    
    onSave(examData);
    
    // Reset form
    setFormData({
      name: '',
      exam_type_id: examTypes[0]?.id || 0,
      class_id: classes[0]?.id || 0,
      subject_id: subjects[0]?.id || 0,
      academic_year_id: academicYears.find(y => y.is_active)?.id || academicYears[0]?.id || 0,
      term_id: terms[0]?.id || 0,
      exam_date: '',
      total_marks: 100,
    });
    setAttachment(null);
    setAttachmentName('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
      setAttachmentName(file.name);
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
                <BookOpen size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Create New Exam</h3>
                <p className="text-blue-100 text-sm">Add assessment details</p>
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
            <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
              <Calendar size={14} className="text-blue-600" />
              Exam Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              placeholder="e.g., Mathematics Final Exam"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Class *</label>
              <select
                value={formData.class_id}
                onChange={(e) => setFormData({ ...formData, class_id: Number(e.target.value) })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              >
                <option value="0">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject *</label>
              <select
                value={formData.subject_id}
                onChange={(e) => setFormData({ ...formData, subject_id: Number(e.target.value) })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              >
                <option value="0">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Academic Year *</label>
              <select
                value={formData.academic_year_id}
                onChange={(e) => setFormData({ ...formData, academic_year_id: Number(e.target.value) })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              >
                <option value="0">Select Year</option>
                {academicYears.map((year) => (
                  <option key={year.id} value={year.id}>{year.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Term *</label>
              <select
                value={formData.term_id}
                onChange={(e) => setFormData({ ...formData, term_id: Number(e.target.value) })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              >
                <option value="0">Select Term</option>
                {terms.map((term) => (
                  <option key={term.id} value={term.id}>{term.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Exam Type *</label>
              <select
                value={formData.exam_type_id}
                onChange={(e) => setFormData({ ...formData, exam_type_id: Number(e.target.value) })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              >
                <option value="0">Select Type</option>
                {examTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Total Marks *</label>
              <input
                type="number"
                min="1"
                required
                value={formData.total_marks}
                onChange={(e) => setFormData({ ...formData, total_marks: Number(e.target.value) })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                placeholder="100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Exam Date *</label>
            <input
              type="date"
              required
              value={formData.exam_date}
              onChange={(e) => setFormData({ ...formData, exam_date: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
              <Upload size={14} className="text-blue-600" />
              Attach File (Optional)
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={triggerFileInput}
                className="flex items-center gap-2 px-3 py-2.5 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 w-full transition-colors"
                title="Click to upload file"
              >
                <Upload size={18} className="text-gray-500" />
                <span className="text-gray-600 text-sm">Click to upload</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                title="Choose file to upload"
              />
              {attachmentName && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <File size={14} />
                  {attachmentName}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Supported formats: PDF, Word, Excel</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Create Exam
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExamModal;