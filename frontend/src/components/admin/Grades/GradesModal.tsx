"use client";

import { useState } from "react";
import api from "@/services/api";
import type { Grade } from "@/types/grade";

type GradeStatus = "Active" | "Inactive";

interface AddGradeModalProps {
  onClose: () => void;
  onGradeAdded?: (newGrade: Grade) => void;
}

const GradesModal = ({ onClose, onGradeAdded }: AddGradeModalProps) => {
  const [gradeName, setGradeName] = useState("");
  const [gradeCode, setGradeCode] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number | "">("");
  const [gradeStatus, setGradeStatus] = useState<GradeStatus>("Active");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!gradeName.trim()) {
      newErrors.gradeName = "Grade Name is required";
    }

    if (!gradeCode.trim()) {
      newErrors.gradeCode = "Grade Code is required";
    }

    if (displayOrder !== "" && (Number(displayOrder) < 0 || isNaN(Number(displayOrder)))) {
      newErrors.displayOrder = "Display Order must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveGrade = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/grades", {
        name: gradeName.trim(),
        code: gradeCode.trim(),
        display_order: displayOrder === "" ? null : Number(displayOrder),
        status: gradeStatus,
      });

      // Reset form
      setGradeName("");
      setGradeCode("");
      setDisplayOrder("");
      setGradeStatus("Active");
      setErrors({});

      // Notify parent component if callback provided
      if (onGradeAdded) {
        onGradeAdded(response.data as Grade);
      }

      // Close modal
      onClose();
    } catch (error: unknown) {
      console.error("Error adding grade:", error);
      
      // Handle specific API errors
      if (error instanceof Error && error.message.includes("unique")) {
        setErrors({ gradeCode: "Grade Code must be unique" });
      } else {
        alert("Failed to add grade. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setGradeName("");
    setGradeCode("");
    setDisplayOrder("");
    setGradeStatus("Active");
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Add Grade</h2>
          <button onClick={handleCancel} className="text-gray-500">✕</button>
        </div>

        {/* Grade Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Grade Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={`w-full border rounded px-4 py-2 ${errors.gradeName ? 'border-red-500' : ''}`}
            placeholder="Enter grade name"
            value={gradeName}
            onChange={(e) => {
              setGradeName(e.target.value);
              if (errors.gradeName) setErrors(prev => ({ ...prev, gradeName: "" }));
            }}
          />
          {errors.gradeName && (
            <p className="text-red-500 text-sm mt-1">{errors.gradeName}</p>
          )}
        </div>

        {/* Grade Code */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Grade Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={`w-full border rounded px-4 py-2 ${errors.gradeCode ? 'border-red-500' : ''}`}
            placeholder="Enter unique grade code"
            value={gradeCode}
            onChange={(e) => {
              setGradeCode(e.target.value);
              if (errors.gradeCode) setErrors(prev => ({ ...prev, gradeCode: "" }));
            }}
          />
          {errors.gradeCode && (
            <p className="text-red-500 text-sm mt-1">{errors.gradeCode}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                checked={gradeStatus === "Active"}
                onChange={() => setGradeStatus("Active")}
                className="mr-2"
              />
              Active
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                checked={gradeStatus === "Inactive"}
                onChange={() => setGradeStatus("Inactive")}
                className="mr-2"
              />
              Inactive
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border rounded hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveGrade}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Grade"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradesModal;