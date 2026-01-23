export interface Term {
  id: string;
  name: string;
  order: number;
  isLocked: boolean;
  lockedDate?: string;
  lockedBy?: string;
  disabled?: boolean;
  tooltip?: string;
}

export type TermStatus = 'OPEN' | 'LOCKED';