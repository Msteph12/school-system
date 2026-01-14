export type PaymentListItem = {
  id: number;
  receiptNumber: string;
  studentName: string;
  admissionNo: string;
  grade: string;
  class: string;
  term: string;
  academicYear: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: string;
  reference: string | null;
  receiptGeneratedAt?: string | null; // 👈 lock flag
};
