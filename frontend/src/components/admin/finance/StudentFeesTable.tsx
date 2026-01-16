import type { StudentFeeListItem } from "@/types/studentFee";

interface Props {
  studentFees: StudentFeeListItem[];
  onView: (fee: StudentFeeListItem) => void;
}

const StudentFeesTable = ({ studentFees, onView }: Props) => {
  if (studentFees.length === 0) {
    return (
      <div className="bg-white p-10 rounded shadow text-center text-gray-500">
        No student fees found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-red-100">
          <tr>
            <th className="p-3 text-left">Student</th>
            <th className="p-3 text-left">Admission No</th>
            <th className="p-3 text-left">Grade</th>
            <th className="p-3 text-left">Class</th>
            <th className="p-3 text-left">Total Fee</th>
            <th className="p-3 text-left">Academic Year</th>
            <th className="p-3 text-left">Term</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {studentFees.map((f) => (
            <tr key={f.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{f.studentName}</td>
              <td className="p-3">{f.admissionNumber}</td>
              <td className="p-3">{f.grade}</td>
              <td className="p-3">{f.class}</td>
              <td className="p-3 font-medium">
                KES {f.totalAmount.toLocaleString()}
              </td>
              <td className="p-3">{f.academicYear}</td>
              <td className="p-3">{f.term}</td>
              <button
                    onClick={() => onView(f)}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentFeesTable;
