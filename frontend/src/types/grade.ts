export interface Grade {
  id: number;
  name: string;
  code: string;
  display_order?: number;
  status: "Active" | "Inactive";
  classCount?: number; // Added class count
}

export interface GradeScale {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}