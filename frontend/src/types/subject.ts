export interface Subject {
  id: string;
  grade_id: string;
  name: string;
  code?: string;
  description?: string;
  status: "Active" | "Inactive";
  created_at?: string;
  updated_at?: string;
}