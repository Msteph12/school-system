export interface Grade {
  id: number;
  name: string;
  code: string;
  order?: number;
  classCount?: number;
}

export interface GradeScale {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export type GradeFormData = {
  name: string;
  status: "active" | "inactive";
};
