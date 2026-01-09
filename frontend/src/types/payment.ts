export type PaymentListItem = {
  id: number;
  studentName: string;
  admissionNo: string;
  grade: string;
  term: string;
  academicYear: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: string;
  reference: string | null;
};
