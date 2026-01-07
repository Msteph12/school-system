export interface StudentAttendance {
  id: number;
  student_name: string;
  admission_number: string;
  status: "reported" | "present" | "sent_home" | "returned" | "withdrawn";
  reason: string | null;
  from_date: string;
  to_date: string | null;
  remarks: string | null;
  student?: {
    id: number;
    name: string;
  };
}
