interface PromotionHistory {
  id: number;
  student_name: string;
  from_grade: string;
  from_class: string;
  to_grade: string;
  to_class: string;
  academic_year: string;
  promoted_at: string;
}

interface Props {
  history: PromotionHistory[];
}

const PromotionHistoryTable = ({ history }: Props) => {
  return (
    <div className="bg-white rounded shadow overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-red-50">
          <tr>
            <th className="p-3 text-left">Student</th>
            <th className="p-3">From</th>
            <th className="p-3">To</th>
            <th className="p-3">Academic Year</th>
            <th className="p-3">Date</th>
          </tr>
        </thead>

        <tbody>
          {history.map(h => (
            <tr key={h.id} className="border-t">
              <td className="p-3">{h.student_name}</td>
              <td className="p-3 text-center">
                {h.from_grade} {h.from_class}
              </td>
              <td className="p-3 text-center">
                {h.to_grade} {h.to_class}
              </td>
              <td className="p-3 text-center">{h.academic_year}</td>
              <td className="p-3 text-center">{h.promoted_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PromotionHistoryTable;
