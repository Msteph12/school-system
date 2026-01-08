export interface ClassTeacher {
  id: number;
  teacher_id: number;
  teacher_name: string;
  grade_id: number;
  grade_name: string;
  class_id: number;
  class_name: string;
  academic_year_id: number;
  is_active: boolean;
}

export interface AssignClassTeacherPayload {
  teacher_id: number;
  grade_id: number;
  class_id: number;
}
