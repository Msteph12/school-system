"use client";

import { useState, useEffect } from "react";
import api from "@/services/api";

type StreamStatus = "active" | "inactive";

interface StreamModalProps {
  onClose: () => void;
  onStreamAdded?: () => void;
  editingStream?: {
    id: string;
    grade_id: string;
    name: string;
    code: string | null;
    status: StreamStatus;
    teacher_id?: string | null;
    capacity?: number | null;
    description?: string | null;
  } | null;
}

interface Grade {
  id: string;
  name: string;
  code: string;
  status: string;
}

interface Teacher {
  id: string;
  name: string;
  email?: string;
  status?: string;
}

interface ApiErrorResponse {
  status?: number;
  data?: {
    message?: string;
    errors?: Record<string, string[]>;
  };
}

interface StreamFormData {
  grade_id: string;
  name: string;
  code?: string | null;
  status: StreamStatus;
  teacher_id: string | null;
  capacity?: number | null;
  description?: string | null;
  is_active?: boolean;
}

const StreamsModal = ({ onClose, onStreamAdded, editingStream }: StreamModalProps) => {
  const [gradeId, setGradeId] = useState<string>(editingStream?.grade_id || "");
  const [streamName, setStreamName] = useState<string>(editingStream?.name || "");
  const [streamCode, setStreamCode] = useState<string>(editingStream?.code || "");
  const [capacity, setCapacity] = useState<number | "">(editingStream?.capacity || "");
  const [description, setDescription] = useState<string>(editingStream?.description || "");
  const [teacherId, setTeacherId] = useState<string>(editingStream?.teacher_id || "");
  const [streamStatus, setStreamStatus] = useState<StreamStatus>(editingStream?.status || "active");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingGrades, setIsFetchingGrades] = useState(false);
  const [isFetchingTeachers, setIsFetchingTeachers] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Fetch grades and teachers on component mount
  useEffect(() => {
    fetchGrades();
    fetchTeachers();
  }, []);

  const fetchGrades = async () => {
    setIsFetchingGrades(true);
    try {
      const response = await api.get("/grades");
      setGrades(response.data);
    } catch (error) {
      console.error("Error fetching grades:", error);
      alert("Failed to fetch grades. Please try again.");
    } finally {
      setIsFetchingGrades(false);
    }
  };

  const fetchTeachers = async () => {
    setIsFetchingTeachers(true);
    try {
      const response = await api.get("/teachers");
      setTeachers(response.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      alert("Failed to fetch teachers. Please try again.");
    } finally {
      setIsFetchingTeachers(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!gradeId.trim()) {
      newErrors.gradeId = "Please select a grade";
    }

    if (!streamName.trim()) {
      newErrors.streamName = "Stream name is required";
    }

    if (streamName.trim().length < 2) {
      newErrors.streamName = "Stream name must be at least 2 characters";
    }

    if (!teacherId.trim()) {
      newErrors.teacherId = "Please select a class teacher";
    }

    if (capacity !== "" && (Number(capacity) < 1 || isNaN(Number(capacity)))) {
      newErrors.capacity = "Capacity must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveStream = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const streamData: StreamFormData = {
        grade_id: gradeId,
        name: streamName.trim(),
        code: streamCode.trim() || null,
        status: streamStatus,
        teacher_id: teacherId || null,
        capacity: capacity === "" ? null : Number(capacity),
        description: description.trim() || null,
      };

      if (editingStream) {
        // Update existing stream
        await api.put(`/school-classes/${editingStream.id}`, streamData);
      } else {
        // Create new stream
        await api.post("/school-classes", {
          ...streamData,
          is_active: streamStatus === "active",
        });
      }

      // Reset form
      resetForm();

      // Notify parent component
      onStreamAdded?.();

      // Close modal
      onClose();
    } catch (error: unknown) {
      console.error("Error saving stream:", error);
      
      // Handle API errors with proper typing
      const apiError = error as ApiErrorResponse;
      
      if (apiError?.data?.message?.includes("already exists")) {
        setErrors({ streamName: "Stream name already exists in this grade" });
      } else if (apiError?.data?.message?.includes("enrolled students")) {
        alert("Cannot delete stream with enrolled students");
      } else if (apiError?.status === 422) {
        // Validation errors from Laravel
        const validationErrors = apiError.data?.errors;
        if (validationErrors) {
          const formattedErrors: { [key: string]: string } = {};
          
          Object.keys(validationErrors).forEach(key => {
            if (validationErrors[key] && validationErrors[key][0]) {
              formattedErrors[key] = validationErrors[key][0];
            }
          });
          
          setErrors(formattedErrors);
        }
      } else {
        alert(`Failed to ${editingStream ? 'update' : 'add'} stream. Please try again.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setGradeId("");
    setStreamName("");
    setStreamCode("");
    setCapacity("");
    setDescription("");
    setTeacherId("");
    setStreamStatus("active");
    setErrors({});
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {editingStream ? "Edit Stream" : "Add New Stream"}
          </h2>
          <button 
            onClick={handleCancel} 
            className="text-gray-500 hover:text-gray-700 text-lg"
            disabled={isLoading}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Grade Selection */}
        <div>
          <label htmlFor="grade-select" className="block text-sm font-medium mb-1">
            Grade <span className="text-red-500">*</span>
          </label>
          <select
            id="grade-select"
            className={`w-full border rounded px-4 py-2 ${errors.gradeId ? 'border-red-500' : ''}`}
            value={gradeId}
            onChange={(e) => {
              setGradeId(e.target.value);
              if (errors.gradeId) setErrors(prev => ({ ...prev, gradeId: "" }));
            }}
            disabled={isFetchingGrades || isLoading}
            aria-label="Select a grade"
            title="Select a grade for this stream"
            aria-describedby={errors.gradeId ? "grade-error" : undefined}
          >
            <option value="">Select a grade</option>
            {grades
              .filter(grade => grade.status === "Active" || grade.id === editingStream?.grade_id)
              .map((grade) => (
                <option key={grade.id} value={grade.id}>
                  {grade.name} ({grade.code})
                </option>
              ))}
          </select>
          {isFetchingGrades && (
            <p className="text-sm text-gray-500 mt-1" aria-live="polite">
              Loading grades...
            </p>
          )}
          {errors.gradeId && (
            <p id="grade-error" className="text-red-500 text-sm mt-1" role="alert">
              {errors.gradeId}
            </p>
          )}
        </div>

        {/* Stream Name */}
        <div>
          <label htmlFor="stream-name" className="block text-sm font-medium mb-1">
            Stream Name <span className="text-red-500">*</span>
          </label>
          <input
            id="stream-name"
            type="text"
            className={`w-full border rounded px-4 py-2 ${errors.streamName ? 'border-red-500' : ''}`}
            placeholder="Enter stream name (e.g., Class A, Science Section)"
            value={streamName}
            onChange={(e) => {
              setStreamName(e.target.value);
              if (errors.streamName) setErrors(prev => ({ ...prev, streamName: "" }));
            }}
            disabled={isLoading}
            aria-label="Stream name"
            aria-describedby={errors.streamName ? "name-error" : undefined}
          />
          {errors.streamName && (
            <p id="name-error" className="text-red-500 text-sm mt-1" role="alert">
              {errors.streamName}
            </p>
          )}
        </div>

        {/* Class Teacher */}
        <div>
          <label htmlFor="teacher-select" className="block text-sm font-medium mb-1">
            Class Teacher <span className="text-red-500">*</span>
          </label>
          <select
            id="teacher-select"
            className={`w-full border rounded px-4 py-2 ${errors.teacherId ? 'border-red-500' : ''}`}
            value={teacherId}
            onChange={(e) => {
              setTeacherId(e.target.value);
              if (errors.teacherId) setErrors(prev => ({ ...prev, teacherId: "" }));
            }}
            disabled={isFetchingTeachers || isLoading}
            aria-label="Select class teacher"
            aria-describedby={errors.teacherId ? "teacher-error" : undefined}
          >
            <option value="">Select a teacher</option>
            {teachers
              .filter(teacher => teacher.status === "active" || teacher.id === editingStream?.teacher_id)
              .map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} {teacher.email ? `(${teacher.email})` : ''}
                </option>
              ))}
          </select>
          {isFetchingTeachers && (
            <p className="text-sm text-gray-500 mt-1" aria-live="polite">
              Loading teachers...
            </p>
          )}
          {errors.teacherId && (
            <p id="teacher-error" className="text-red-500 text-sm mt-1" role="alert">
              {errors.teacherId}
            </p>
          )}
        </div>

        {/* Stream Code (Unique) */}
        <div>
          <label htmlFor="stream-code" className="block text-sm font-medium mb-1">
            Stream Code
          </label>
          <input
            id="stream-code"
            type="text"
            className="w-full border rounded px-4 py-2"
            placeholder="Enter unique code (optional)"
            value={streamCode}
            onChange={(e) => setStreamCode(e.target.value)}
            disabled={isLoading}
            aria-label="Stream code"
          />
          <p className="text-sm text-gray-500 mt-1">
            Unique identifier for the stream
          </p>
        </div>

        {/* Status */}
        <fieldset>
          <legend className="block text-sm font-medium mb-1">Status</legend>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="active"
                checked={streamStatus === "active"}
                onChange={() => setStreamStatus("active")}
                className="mr-2"
                disabled={isLoading}
                aria-label="Set stream status to active"
              />
              Active
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="inactive"
                checked={streamStatus === "inactive"}
                onChange={() => setStreamStatus("inactive")}
                className="mr-2"
                disabled={isLoading}
                aria-label="Set stream status to inactive"
              />
              Inactive
            </label>
          </div>
        </fieldset>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
            aria-label="Cancel and close modal"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveStream}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
            aria-label={editingStream ? "Update stream" : "Create new stream"}
          >
            {isLoading 
              ? (editingStream ? "Updating..." : "Creating...") 
              : (editingStream ? "Update Stream" : "Create Stream")
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default StreamsModal;