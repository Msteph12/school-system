"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import TopBar from "@/components/admin/TopBar";
import SubjectsModal from "@/components/admin/Grades/SubjectsModal";
import type { Grade } from "@/types/grade";
import type { Subject } from "@/types/subject";

// Import components
import GradeCard from "@/components/admin/Grades/GradeCard";
import SummaryCard from "@/components/admin/Grades/SummaryCard";
import SubjectsTable from "@/components/admin/Grades/SubjectsTable";
import LoadingState from "@/components/admin/Grades/LoadingState";
import EmptyStates from "@/components/admin/Grades/EmptyStates";
import HeaderSection from "@/components/admin/Grades/HeaderSection";
import QuickActions from "@/components/admin/Grades/QuickActions";

const SubjectsPerGrade = () => {
  const [showModal, setShowModal] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch grades and subjects on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    
    try {
      // Fetch grades
      const gradesResponse = await api.get("/grades");
      const gradesData = gradesResponse.data;
      setGrades(gradesData);

      // Fetch subjects
      const subjectsResponse = await api.get("/subjects");
      const subjectsData = subjectsResponse.data;
      setSubjects(subjectsData);
      
    } catch (error) {
      console.error("Error loading data:", error);
      // Don't show a large error, just set empty arrays
      setGrades([]);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle subject added from modal
  const handleSubjectAdded = (newSubject: Subject) => {
    setSubjects(prev => [...prev, newSubject]);
  };

  // Handle grade card click - navigate to grade subjects page
  const handleGradeCardClick = (grade: Grade) => {
    navigate(`/admin/subjects/grade/${grade.id}`, {
      state: {
        grade,
        subjects: subjects.filter(s => s.grade_id === String(grade.id))
      }
    });
  };

  // Handle subject deletion
  const handleDeleteSubject = async (subjectId: string) => {
    try {
      await api.delete(`/subjects/${subjectId}`);
      setSubjects(prev => prev.filter(s => s.id !== subjectId));
    } catch (error) {
      console.error("Error deleting subject:", error);
      throw new Error("Failed to delete subject. Please try again.");
    }
  };

  // Handle subject status toggle
  const handleToggleStatus = async (subject: Subject) => {
    const newStatus = subject.status === "Active" ? "Inactive" : "Active";
    
    try {
      const updatedSubject: Subject = { 
        ...subject, 
        status: newStatus 
      };
      await api.put(`/subjects/${subject.id}`, updatedSubject);
      setSubjects(prev => prev.map(s => 
        s.id === subject.id ? updatedSubject : s
      ));
    } catch (error) {
      console.error("Error updating subject status:", error);
      throw new Error("Failed to update subject status. Please try again.");
    }
  };

  // Handle subject edit
  const handleEditSubject = async (subjectId: string, updatedData: Partial<Subject>) => {
    try {
      await api.put(`/subjects/${subjectId}`, updatedData);
      setSubjects(prev => prev.map(s => 
        s.id === subjectId ? { ...s, ...updatedData } as Subject : s
      ));
    } catch (error) {
      console.error("Error updating subject:", error);
      throw new Error("Failed to update subject. Please try again.");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <TopBar />
        <HeaderSection
          title="Subjects per Grade"
          description=""
          onBack={() => navigate(-1)}
        />
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <TopBar />

      <HeaderSection
        title="Subjects per Grade"
        description="Browse and manage subjects assigned to each grade"
        onBack={() => navigate(-1)}
      />

      {/* Quick Navigation Section with Add Subject Button */}
      <QuickActions
        title="Subjects Management"
        description="Add new subjects or browse existing ones by grade"
        buttonText="Add Subject"
        onButtonClick={() => setShowModal(true)}
      />

      {/* Summary Cards - Always visible, even with zero values */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Grades"
          value={grades.length}
          description="Active grades in system"
          gradient="red"
        />
        <SummaryCard
          title="Total Subjects"
          value={subjects.length}
          description="Subjects across all grades"
          gradient="green"
        />
        <SummaryCard
          title="Active Subjects"
          value={subjects.filter(s => s.status === 'Active').length}
          description="Currently active subjects"
          gradient="blue"
        />
      </div>

      {/* Grade Cards Grid - Shows empty state if no grades */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {grades.length > 0 ? (
          grades.map((grade) => (
            <GradeCard
              key={grade.id}
              grade={grade}
              subjects={subjects}
              onClick={handleGradeCardClick}
            />
          ))
        ) : (
          <div className="col-span-full">
            <EmptyStates type="grades" />
          </div>
        )}
      </div>

      {/* Subjects Table - Always shows table heads */}
      <SubjectsTable
        subjects={subjects}
        grades={grades}
        onDeleteSubject={handleDeleteSubject}
        onToggleStatus={handleToggleStatus}
        onEditSubject={handleEditSubject}
      />

      {/* Add Subject Modal */}
      {showModal && (
        <SubjectsModal
          grades={grades}
          onClose={() => setShowModal(false)}
          onSubjectAdded={handleSubjectAdded}
        />
      )}
    </div>
  );
};

export default SubjectsPerGrade;