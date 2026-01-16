// @/types/grade.ts
export interface Grade {
  id: number;
  name: string;
  code: string;
  display_order?: number;
  status: "Active" | "Inactive";
  created_at?: string;
  updated_at?: string;
}