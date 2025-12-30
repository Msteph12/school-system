export type StudentListItem = {
  id: number;
  admissionNo: string;
  name: string;
  grade: string;
  class: string;
};

export type StudentFull = {
  id: number;
  admission_number: string;
  first_name: string;
  last_name: string;
  gender?: string;
  status?: string;
    grade_id?: string;
    class_id?: string;
    guardian_name?: string;
    guardian_phone?: string;
    date_of_birth?: string;
};
