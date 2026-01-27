import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Upload, File, Calendar, BookOpen } from 'lucide-react';
import type { Exam, ExamType } from '@/types/assessment';

interface CreateExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (examData: Omit<Exam, 'id'>) => void;
  examTypes: ExamType[];
}

const CreateExamModal: React.FC<CreateExamModalProps> = ({ isOpen, onClose, onSave, examTypes }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    term: 'Term 1',
    grade: 'Grade 9',
    startDate: '',
    endDate: '',
    status: 'scheduled' as Exam['status'],
    type: 'test' as Exam['type'],
  });
  const [attachment, setAttachment] = useState<string>('');
  const [errors, setErrors] = useState<{startDate?: string; endDate?: string}>({});

  // Function to update status based on dates
  const updateStatusBasedOnDates = useCallback(() => {
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let newStatus = formData.status;
      
      if (endDate < today) {
        newStatus = 'completed';
      } else if (startDate <= today && endDate >= today) {
        newStatus = 'active';
      } else if (startDate > today) {
        newStatus = 'scheduled';
      }
      
      if (newStatus !== formData.status) {
        setFormData(prev => ({ ...prev, status: newStatus }));
      }
    }
  }, [formData.startDate, formData.endDate, formData.status]);

  // Validate dates function
  const validateDates = useCallback(() => {
    const newErrors: {startDate?: string; endDate?: string} = {};
    
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      if (endDate < startDate) {
        newErrors.endDate = 'End date cannot be before start date';
      }
    }
    
    setErrors(newErrors);
  }, [formData.startDate, formData.endDate]);

  // Validate dates and update status on initial mount and when dates change
  useEffect(() => {
    const timer = setTimeout(() => {
      validateDates();
      updateStatusBasedOnDates();
    }, 0);
    
    return () => clearTimeout(timer);
  }, [validateDates, updateStatusBasedOnDates]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (errors.startDate || errors.endDate) {
      alert('Please fix date errors before submitting');
      return;
    }
    
    // Final status validation based on dates
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let finalStatus = formData.status;
    if (endDate < today) {
      finalStatus = 'completed';
    } else if (startDate <= today && endDate >= today) {
      finalStatus = 'active';
    } else if (startDate > today) {
      finalStatus = 'scheduled';
    }
    
    onSave({
      ...formData,
      status: finalStatus,
      ...(attachment && { attachment }),
    });
    
    // Reset form
    setFormData({ 
      name: '', 
      term: 'Term 1', 
      grade: 'Grade 9', 
      startDate: '', 
      endDate: '', 
      status: 'scheduled', 
      type: 'test' 
    });
    setAttachment('');
    setErrors({});
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAttachment(file.name);
  };

  const calculateDuration = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const duration = calculateDuration(formData.startDate, formData.endDate);

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
            <label htmlFor="examName" className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
              <Calendar size={14} className="text-blue-600" />
              Exam Name *
            </label>
            <input
              id="examName"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              placeholder="e.g., Mathematics Final Exam"
              title="Enter exam name"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="termSelect" className="block text-sm font-medium text-gray-700 mb-1.5">Term *</label>
              <select
                id="termSelect"
                value={formData.term}
                onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                title="Select exam term"
              >
                {['Term 1', 'Term 2', 'Term 3'].map((term) => (
                  <option key={term} value={term}>{term}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="gradeSelect" className="block text-sm font-medium text-gray-700 mb-1.5">Grade *</label>
              <select
                id="gradeSelect"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                title="Select exam grade"
              >
                {['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map((grade) => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="typeSelect" className="block text-sm font-medium text-gray-700 mb-1.5">Exam Type *</label>
              <select
                id="typeSelect"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Exam['type'] })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                title="Select exam type"
              >
                {examTypes.map((type) => (
                  <option key={type.id} value={type.name.toLowerCase().replace(' ', '-')}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="statusSelect" className="block text-sm font-medium text-gray-700 mb-1.5">Status *</label>
              <select
                id="statusSelect"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Exam['status'] })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                title="Select exam status"
              >
                <option value="scheduled">Scheduled</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1.5">Start Date *</label>
              <input
                id="startDate"
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                title="Select exam start date"
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1.5">End Date *</label>
              <input
                id="endDate"
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                title="Select exam end date"
              />
              {errors.endDate && (
                <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
              )}
            </div>
          </div>

          {duration > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700">
                Duration: <span className="font-semibold">{duration} days</span>
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Status will be automatically set based on dates: <span className="font-semibold capitalize">{formData.status}</span>
              </p>
            </div>
          )}

          <div>
            <label htmlFor="fileUpload" className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
              <Upload size={14} className="text-blue-600" />
              Attach File (Optional)
            </label>
            <div className="flex items-center gap-3">
              <button
                id="fileUpload"
                type="button"
                onClick={() => fileInputRef.current?.click()}
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
              {attachment && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <File size={14} />
                  {attachment}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
              title="Cancel exam creation"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              disabled={!!errors.startDate || !!errors.endDate}
              title="Create new exam"
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