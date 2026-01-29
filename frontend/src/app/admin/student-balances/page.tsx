"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import TopBar from "@/components/admin/TopBar";
import QuickNavCards from "@/components/common/QuickNavCards";
import type { QuickNavCard } from "@/types/result";

interface Student {
  id: number;
  name: string;
  grade: string;
  class: string;
}

interface StudentBalanceRow extends Student {
  totalFees: number;
  totalPaid: number;
  balance: number;
}

interface Grade {
  id: number;
  name: string;
}

interface SchoolClass {
  id: number;
  name: string;
  grade: string;
}

const ACADEMIC_YEAR_ID = 1;
const TERM_ID = 1;

const StudentBalancesPage = () => {
  const [students, setStudents] = useState<StudentBalanceRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [grades, setGrades] = useState<Grade[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);

  const [gradeFilter, setGradeFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");

  useEffect(() => {
    const loadBalances = async () => {
      setLoading(true);

      try {
        const studentsRes = await api.get("/students");
        const studentsList: Student[] = studentsRes.data;

        const balances = await Promise.all(
          studentsList.map(async (s) => {
            const res = await api.get(`/students/${s.id}/balance`, {
              params: {
                academic_year_id: ACADEMIC_YEAR_ID,
                term_id: TERM_ID,
              },
            });

            return {
              ...s,
              totalFees: res.data.total_fees,
              totalPaid: res.data.total_paid,
              balance: res.data.balance_due,
            };
          })
        );

        setStudents(balances.filter((s) => s.balance > 0));
      } finally {
        setLoading(false);
      }
    };

    loadBalances();
  }, []);

  useEffect(() => {
    api.get("/grades").then((res) => setGrades(res.data));
    api.get("/classes").then((res) => setClasses(res.data));
  }, []);

  const filteredStudents = students.filter(
    (s) =>
      (gradeFilter ? s.grade === gradeFilter : true) &&
      (classFilter ? s.class === classFilter : true)
  );

  // Quick navigation cards data
  const quickNavCards: QuickNavCard[] = [
    {
      title: "Fee Structure",
      description: "View and manage fee structures",
      onClick: () => (window.location.href = "/admin/finance"),
      gradient: "from-blue-500 to-blue-700",
    },
    {
      title: "Payments",
      description: "Manage Payments in the School",
      onClick: () => (window.location.href = "/admin/payments"),
      gradient: "from-green-500 to-green-700",
    },
    {
      title: "Student Fees",
      description: "View students with outstanding fees",
      onClick: () => (window.location.href = "/admin/finance/student-fees"),
      gradient: "from-purple-500 to-purple-700",
    },
  ];

  return (
    <div className="space-y-6">
      <TopBar />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          Students With Balances
        </h1>
        <button
          onClick={() => window.history.back()}
          className="text-blue-600 mr-5 hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* Quick navigation cards */}
      <QuickNavCards cards={quickNavCards} />

      {/* Filters */}
      <div className="flex gap-4 bg-white p-4 rounded shadow-md shadow-red-200">
        <select
          className="border rounded px-3 py-2 text-sm"
          value={gradeFilter}
          onChange={(e) => {
            setGradeFilter(e.target.value);
            setClassFilter("");
          }}
        >
          <option value="">All Grades</option>
          {grades.map((g) => (
            <option key={g.id} value={g.name}>
              {g.name}
            </option>
          ))}
        </select>

        <select
          className="border rounded px-3 py-2 text-sm"
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          disabled={!gradeFilter}
        >
          <option value="">All Classes</option>
          {classes
            .filter((c) => c.grade === gradeFilter)
            .map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Student</th>
              <th className="p-3">Grade</th>
              <th className="p-3">Class</th>
              <th className="p-3">Total Fees</th>
              <th className="p-3">Total Paid</th>
              <th className="p-3 text-red-600">Balance</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No students with balances
                </td>
              </tr>
            ) : (
              filteredStudents.map((s) => (
                <tr key={s.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{s.name}</td>
                  <td className="p-3 text-center">{s.grade}</td>
                  <td className="p-3 text-center">{s.class}</td>
                  <td className="p-3 text-center">
                    KES {s.totalFees.toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    KES {s.totalPaid.toLocaleString()}
                  </td>
                  <td className="p-3 text-center font-semibold text-red-600">
                    KES {s.balance.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentBalancesPage;