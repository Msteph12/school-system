export const getPromotionHistory = async () => {
  // TEMP demo data (real API later)
  return Promise.resolve([
    {
      id: 1,
      student_name: "John Mwangi",
      from_grade: "Grade 2",
      from_class: "Blue",
      to_grade: "Grade 3",
      to_class: "Red",
      academic_year: "2023 / 2024",
      promoted_at: "2024-11-30",
    },
    {
      id: 2,
      student_name: "Faith Achieng",
      from_grade: "Grade 1",
      from_class: "Green",
      to_grade: "Grade 2",
      to_class: "Yellow",
      academic_year: "2023 / 2024",
      promoted_at: "2024-11-30",
    },
  ]);
};
