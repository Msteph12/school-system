import type { PaymentListItem } from "@/types/payment";
import api from "@/services/api";

interface Props {
  payments: PaymentListItem[];
  onView: (payment: PaymentListItem) => void;
}

const PaymentsTable = ({ payments, onView }: Props) => {
  if (payments.length === 0) {
    return (
      <div className="bg-white p-10 rounded shadow text-center text-gray-500">
        No payments found.
      </div>
    );
  }

  const printReceipt = async (paymentId: number) => {
    const res = await api.get(
      `/fee-receipts/${paymentId}/pdf`,
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([res.data]));
    window.open(url);
  };

  return (
    <div className="bg-white rounded shadow overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-red-100">
          <tr>
            <th className="p-3 text-left">Receipt No</th>
            <th className="p-3 text-left">Student</th>
            <th className="p-3 text-left">Admission No</th>
            <th className="p-3 text-left">Amount</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((p) => {
            const isLocked = Boolean(p.receiptGeneratedAt);

            return (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">
                  {p.receiptNumber ?? "-"}
                </td>
                <td className="p-3">{p.studentName}</td>
                <td className="p-3">{p.admissionNo}</td>
                <td className="p-3 font-medium">{p.amountPaid}</td>
                <td className="p-3">{p.paymentDate}</td>
                <td className="p-3 flex items-center gap-3">
                  <button
                    onClick={() => onView(p)}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>

                  <button
                    onClick={() => printReceipt(p.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    Print
                  </button>

                  {isLocked && (
                    <span className="text-xs text-gray-500">Locked</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentsTable;
