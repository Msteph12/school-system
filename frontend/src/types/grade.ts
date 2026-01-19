export interface Grade {
  id: number;
  name: string;
  code: string;
  display_order?: number;
  status: "Active" | "Inactive";
  classCount?: number; // Added class count
}