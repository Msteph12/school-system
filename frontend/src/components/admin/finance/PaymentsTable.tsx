import type { PaymentListItem } from "@/types/payment";

interface Props {
  payments: PaymentListItem[];
}

const PaymentsTable = ({ payments }: Props) => {
  if (payments.length === 0) {
    return (
      <div className="bg-white p-10 rounded shadow text-center text-gray-500">
        No payments found.
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
            <th className="p-3 text-left">Term</th>
            <th className="p-3 text-left">Year</th>
            <th className="p-3 text-left">Amount</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Method</th>
            <th className="p-3 text-left">Reference</th>
          </tr>
        </thead>

        <tbody>
          {payments.map(p => (
            <tr key={p.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{p.studentName}</td>
              <td className="p-3">{p.admissionNo}</td>
              <td className="p-3">{p.grade}</td>
              <td className="p-3">{p.term}</td>
              <td className="p-3">{p.academicYear}</td>
              <td className="p-3 font-medium">{p.amountPaid}</td>
              <td className="p-3">{p.paymentDate}</td>
              <td className="p-3">{p.paymentMethod}</td>
              <td className="p-3">{p.reference ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentsTable;
