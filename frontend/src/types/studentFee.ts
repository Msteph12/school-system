export type StudentFeeOptionalItem = {
  name: string;
  amount: number;
};

export type StudentFeeListItem = {
  id: number;

  studentId: number;
  admissionNumber: string; // maps from backend admission_number
  studentName: string;

  grade: string;
  class: string;

  mandatoryAmount: number;
  optionalFees: StudentFeeOptionalItem[];
  totalAmount: number;

  amountPaid: number;
  balance: number;

  academicYear: string;
  term: string;

  createdAt: string;
};
