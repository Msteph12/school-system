export interface Stream {
  id: string;
  name: string;
  code: string;
  display_order?: number;
  status: "Active" | "Inactive";
  gradeId: string;
  gradeName: string;
}