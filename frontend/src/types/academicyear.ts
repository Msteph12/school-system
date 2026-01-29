export interface AcademicYear {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  status: 'planned' | 'active' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface AcademicYearFormData {
  name: string;
  start_date: string;
  end_date: string;
  status: 'planned' | 'active' | 'closed';
}