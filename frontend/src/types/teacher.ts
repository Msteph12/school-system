// Used in tables / lists
export type TeacherListItem = {
  id: number;
  staff_number: string;
  name: string;
  department: string;
  phone: string;
};

// Used in view / edit modal
export type TeacherFull = {
  id: number;
  staff_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string;
  status: string;
  subjects?: string[];
  created_at?: string;
};
