"use client";

import { useState, useEffect } from "react";
import api from "@/services/api";
import type { Grade } from "@/types/grade";

interface GradesModalProps {
  onClose: () => void;
  onGradeAdded?: (grade: Grade) => void;
  gradeToEdit?: Grade | null;
}

const GradesModal = ({
  onClose,
  onGradeAdded,
  gradeToEdit,
}: GradesModalProps) => {
  const [gradeName, setGradeName] = useState("");
  const [gradeCode, setGradeCode] = useState("");
  const [order, setOrder] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form when editing
  useEffect(() => {
    if (gradeToEdit) {
      setGradeName(gradeToEdit.name);
      setGradeCode(gradeToEdit.code);
      setOrder(gradeToEdit.order ?? "");
    }
  }, [gradeToEdit]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!gradeName.trim()) newErrors.gradeName = "Grade Name is required";
    if (!gradeCode.trim()) newErrors.gradeCode = "Grade Code is required";
    if (order === "" || Number(order) < 1 || isNaN(Number(order))) {
      newErrors.order = "Display Order must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveGrade = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = {
        name: gradeName.trim(),
        code: gradeCode.trim(),
        order: Number(order),
      };

      const response = gradeToEdit
        ? await api.put(`/grades/${gradeToEdit.id}`, payload)
        : await api.post("/grades", payload);

      onGradeAdded?.(response.data as Grade);
      onClose();
    } catch {
      setErrors({ gradeCode: "Grade name or code must be unique" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {gradeToEdit ? "Edit Grade" : "Add Grade"}
          </h2>
          <button onClick={handleCancel} className="text-gray-500">
            ✕
          </button>
        </div>

        {/* Grade Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Grade Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Grade 1, Playgroup"
            className={`w-full border rounded px-4 py-2 ${
              errors.gradeName ? "border-red-500" : ""
            }`}
            value={gradeName}
            onChange={(e) => {
              setGradeName(e.target.value);
              if (errors.gradeName)
                setErrors((p) => ({ ...p, gradeName: "" }));
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
            placeholder="e.g. G1, PG, PP1"
            className={`w-full border rounded px-4 py-2 ${
              errors.gradeCode ? "border-red-500" : ""
            }`}
            value={gradeCode}
            onChange={(e) => {
              setGradeCode(e.target.value);
              if (errors.gradeCode)
                setErrors((p) => ({ ...p, gradeCode: "" }));
            }}
          />
          {errors.gradeCode && (
            <p className="text-red-500 text-sm mt-1">{errors.gradeCode}</p>
          )}
        </div>

        {/* Display Order */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Display Order <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min={1}
            className={`w-full border rounded px-4 py-2 ${
              errors.order ? "border-red-500" : ""
            }`}
            value={order}
            onChange={(e) => {
              setOrder(e.target.value === "" ? "" : Number(e.target.value));
              if (errors.order)
                setErrors((p) => ({ ...p, order: "" }));
            }}
          />
          {errors.order && (
            <p className="text-red-500 text-sm mt-1">{errors.order}</p>
          )}
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
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading
              ? "Saving..."
              : gradeToEdit
              ? "Update Grade"
              : "Save Grade"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradesModal;
