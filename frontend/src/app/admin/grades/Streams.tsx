"use client";

import { useState, useEffect } from "react";
import TopBar from "@/components/admin/TopBar";
import StreamsModal from "@/components/admin/Grades/StreamsModal";
import StreamsTable from "@/components/admin/Grades/StreamsTable";
import type { Grade } from "@/types/grade";
import type { Stream } from "@/types/stream";

const StreamsPage = () => { 
  const [showModal, setShowModal] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [allStreams, setAllStreams] = useState<Stream[]>([]);
  const [filteredStreams, setFilteredStreams] = useState<Stream[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStreams, setIsLoadingStreams] = useState(false);

  // Fetch grades and streams on component mount
  useEffect(() => {
    fetchGrades();
    fetchAllStreams();
  }, []);

  // Filter streams when selectedGrade changes
  useEffect(() => {
    if (!selectedGrade) {
      // Show all streams sorted by grade name
      const sortedStreams = [...allStreams].sort((a, b) => {
        // First sort by grade name
        const gradeCompare = a.gradeName.localeCompare(b.gradeName);
        if (gradeCompare !== 0) return gradeCompare;
        
        // Then sort by stream display order if same grade
        return (a.display_order || 0) - (b.display_order || 0);
      });
      setFilteredStreams(sortedStreams);
    } else {
      // Filter streams for selected grade
      const filtered = allStreams
        .filter(stream => String(stream.gradeId) === String(selectedGrade.id))
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      setFilteredStreams(filtered);
    }
  }, [selectedGrade, allStreams]);

  const fetchGrades = async () => {
    try {
      setIsLoading(true);
      // Replace with your actual API call
      const response = await fetch('/api/grades');
      const data = await response.json();
      const sortedGrades = (data.grades || []).sort((a: Grade, b: Grade) => 
        a.name.localeCompare(b.name)
      );
      setGrades(sortedGrades);
    } catch (error) {
      console.error("Error fetching grades:", error);
      setGrades([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllStreams = async () => {
    try {
      setIsLoadingStreams(true);
      // Replace with your actual API call
      // Make sure your API returns streams with gradeId and gradeName
      const response = await fetch('/api/streams');
      const data = await response.json();
      setAllStreams(data.streams || []);
    } catch (error) {
      console.error("Error fetching streams:", error);
      setAllStreams([]);
    } finally {
      setIsLoadingStreams(false);
    }
  };

  const handleCloseFilter = () => {
    setSelectedGrade(null);
  };

  const handleViewStream = (stream: Stream) => {
    console.log("View stream", stream);
  };

  const handleEditStream = (stream: Stream) => {
    console.log("Edit stream", stream);
  };

  // Get display title based on selection
  const getTableTitle = () => {
    if (selectedGrade) {
      return `Streams for ${selectedGrade.name}`;
    }
    return "All Streams (Grouped by Grade)";
  };

  // Get unique grade count for display
  const getUniqueGradeCount = () => {
    if (!selectedGrade) {
      const gradeIds = new Set(allStreams.map(stream => stream.gradeId));
      return gradeIds.size;
    }
    return 1;
  };

  return (
    <div className="space-y-6">
      <TopBar />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Streams</h1>
        <button
          onClick={() => window.history.back()}
          className="text-blue-600 mr-5 hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 bg-white p-4 rounded shadow-md">
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          + Add Stream
        </button>
        
        {/* Grade Selection Dropdown */}
        <div className="ml-auto">
          <label htmlFor="gradeSelect" className="mr-2 text-gray-700">
            Filter by Grade:
          </label>
          <select
            id="gradeSelect"
            value={selectedGrade?.id || ""}
            onChange={(e) => {
              const gradeId = e.target.value;
              if (!gradeId) {
                setSelectedGrade(null);
              } else {
                const grade = grades.find(g => String(g.id) === gradeId);
                setSelectedGrade(grade || null);
              }
            }}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="">All Grades</option>
            {grades.map((grade) => (
              <option key={grade.id} value={grade.id}>
                {grade.name} ({grade.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading || isLoadingStreams ? (
        <div className="bg-white p-10 rounded shadow-md shadow-blue-200 text-center">
          Loading streams data...
        </div>
      ) : (
        <StreamsTable
          streams={filteredStreams}
          gradeName={getTableTitle()}
          onClose={selectedGrade ? handleCloseFilter : undefined}
          onView={handleViewStream}
          onEdit={handleEditStream}
          showGradeColumn={!selectedGrade}
          gradeCount={getUniqueGradeCount()}
          totalStreams={allStreams.length}
        />
      )}

      {/* Modal */}
      {showModal && (
        <StreamsModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default StreamsPage;