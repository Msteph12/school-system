export interface Class {
  id: string;
  name: string;
  code: string;
  display_order?: number;
  status: "Active" | "Inactive";
  gradeId: string;
  gradeName: string;
}