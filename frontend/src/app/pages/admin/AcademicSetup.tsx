"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '@/components/admin/TopBar';
import QuickNavCards from '@/components/admin/results/QuickNavCards';
import AcademicYearsTable from '@/components/admin/academic/AcademicYearsTable';
import AcademicYearModal from '@/components/admin/academic/AcademicYearModal';
import type { AcademicYear, AcademicYearFormData } from '@/types/academicyear';
import { academicYearService } from '@/services/academicYears';

const AcademicSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [filteredYears, setFilteredYears] = useState<AcademicYear[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);
  const [selectedYearId, setSelectedYearId] = useState<string | null>(null);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'activate' | 'close'>('add');

  // Filter academic years based on search
  useEffect(() => {
    if (!search.trim()) {
      setFilteredYears(academicYears);
      return;
    }

    const searchTerm = search.toLowerCase();
    const filtered = academicYears.filter(year =>
      year.name.toLowerCase().includes(searchTerm) ||
      year.status.toLowerCase().includes(searchTerm) ||
      year.start_date.toLowerCase().includes(searchTerm) ||
      year.end_date.toLowerCase().includes(searchTerm)
    );
    
    setFilteredYears(filtered);
  }, [academicYears, search]);

  // Quick navigation cards
  const quickNavCards = [
    {
      title: "Admin Dashboard",
      description: "Return to dashboard",
      gradient: "from-blue-600/80 to-blue-400/80",
       onClick: () => navigate("/admin"),
    },
    {
      title: "Term Lock Status",
      description: "Lock/unlock terms for results submission",
      gradient: "from-red-600/80 to-red-400/80",
      onClick: () => navigate("/admin/TermLock"),
    },
  ];

  // Load academic years from API
  const loadAcademicYears = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const yearsData = await academicYearService.getAcademicYears();
      setAcademicYears(yearsData);
      setFilteredYears(yearsData);
    } catch (err: unknown) {
      console.error('Failed to load academic years:', err);
      setError('Failed to load academic years data. Please try again.');
      setAcademicYears([]);
      setFilteredYears([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    loadAcademicYears();
  }, [loadAcademicYears]);

  const handleAddYear = () => {
    setEditingYear(null);
    setModalType('add');
    setShowModal(true);
  };

  const handleEditYear = (year: AcademicYear) => {
    setEditingYear(year);
    setModalType('edit');
    setShowModal(true);
  };

  const handleActivateYear = (id: string) => {
    setSelectedYearId(id);
    setModalType('activate');
    setShowModal(true);
  };

  const handleCloseYear = (id: string) => {
    setSelectedYearId(id);
    setModalType('close');
    setShowModal(true);
  };

  const handleSaveYear = async (yearData: AcademicYearFormData) => {
    try {
      if (editingYear) {
        // Update existing academic year
        const updatedYear = await academicYearService.updateAcademicYear(editingYear.id, yearData);
        setAcademicYears(prev => prev.map(year => 
          year.id === editingYear.id ? updatedYear : year
        ));
        alert('Academic year updated successfully!');
      } else {
        // Add new academic year
        const newYear = await academicYearService.createAcademicYear(yearData);
        setAcademicYears(prev => [...prev, newYear]);
        alert('Academic year added successfully!');
      }
      setShowModal(false);
      setEditingYear(null);
    } catch (err: unknown) {
      console.error('Failed to save academic year:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save academic year. Please try again.';
      alert(errorMessage);
    }
  };

  const handleConfirmAction = async () => {
    if (!selectedYearId) return;

    try {
      let updatedYear: AcademicYear;
      
      if (modalType === 'activate') {
        updatedYear = await academicYearService.activateAcademicYear(selectedYearId);
      } else if (modalType === 'close') {
        updatedYear = await academicYearService.closeAcademicYear(selectedYearId);
      } else {
        return;
      }

      setAcademicYears(prev => prev.map(year => 
        year.id === selectedYearId ? updatedYear : year
      ));
      
      const actionText = modalType === 'activate' ? 'activated' : 'closed';
      alert(`Academic year ${actionText} successfully!`);
      setShowModal(false);
      setSelectedYearId(null);
    } catch (err: unknown) {
      console.error('Failed to update academic year:', err);
      const errorMessage = err instanceof Error ? err.message : `Failed to ${modalType} academic year. Please try again.`;
      alert(errorMessage);
    }
  };

  // Calculate status summary using filtered data for counts
  const activeYear = academicYears.find(year => year.status === 'active');
  const plannedYears = filteredYears.filter(year => year.status === 'planned').length;
  const closedYears = filteredYears.filter(year => year.status === 'closed').length;

  return (
    <div className="space-y-6 p-6">
      <TopBar
        searchValue={search}
        onSearchChange={setSearch}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Academic Setup</h1>
          <p className="text-gray-600">Manage academic years and related configurations</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline"
        >
          ← Back
        </button>
      </div>

      <QuickNavCards cards={quickNavCards} />

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <div className="w-8 h-8 flex items-center justify-center">
                <span className="text-blue-600 font-bold">A</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Academic Year</p>
              <p className="text-xl font-semibold text-gray-900">
                {activeYear ? activeYear.name : 'None'}
              </p>
              {activeYear && (
                <p className="text-xs text-gray-500 mt-1">
                  Active since {new Date(activeYear.updated_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg mr-4">
              <div className="w-8 h-8 flex items-center justify-center">
                <span className="text-yellow-600 font-bold">P</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Planned Years</p>
              <p className="text-xl font-semibold text-gray-900">{plannedYears}</p>
              <p className="text-xs text-gray-500 mt-1">
                {search ? 'Filtered planned years' : 'Years scheduled for future'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-100 p-6 rounded-xl border border-gray-100">
          <div className="flex items-center">
            <div className="bg-red-200 p-3 rounded-lg mr-4">
              <div className="w-8 h-8 flex items-center justify-center">
                <span className="text-gray-600 font-bold">C</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Closed Years</p>
              <p className="text-xl font-semibold text-gray-900">{closedYears}</p>
              <p className="text-xs text-gray-500 mt-1">
                {search ? 'Filtered completed years' : 'Completed academic years'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results Info */}
      {search && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm text-gray-600">
                Showing {filteredYears.length} of {academicYears.length} academic years
                {search && ` for "${search}"`}
              </span>
            </div>
            <button
              onClick={() => setSearch('')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear search
            </button>
          </div>
        </div>
      )}

      {/* Academic Years Section */}
      <div id="academic-years-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Academic Years</h2>
            {search && (
              <p className="text-sm text-gray-600 mt-1">
                Filtered results ({filteredYears.length} found)
              </p>
            )}
          </div>
          <button
            onClick={handleAddYear}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-300 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Academic Year
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <AcademicYearsTable
            academicYears={filteredYears}
            onEdit={handleEditYear}
            onActivate={handleActivateYear}
            onClose={handleCloseYear}
            isLoading={isLoading}
            error={error}
            onRetry={loadAcademicYears}
          />
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <AcademicYearModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingYear(null);
            setSelectedYearId(null);
          }}
          onSave={handleSaveYear}
          onConfirmAction={handleConfirmAction}
          initialData={editingYear}
          modalType={modalType}
          selectedYear={academicYears.find(y => y.id === selectedYearId)}
        />
      )}
    </div>
  );
};

export default AcademicSetupPage;