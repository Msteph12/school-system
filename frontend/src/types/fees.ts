export type FeeStructureListItem = {
  id: number;
  grade: string;
  term: string;
  academicYear: string;
  totalAmount: number;
};

export type CreateFeeStructurePayload = {
  grade_id: number;
  academic_year_id: number;
  term_id: number;
  mandatory_amount: number;
  optional_fees: {
    name: string;
    amount: number;
    is_active?: boolean;
  }[];
  payment_details: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
  remarks?: string;
};

