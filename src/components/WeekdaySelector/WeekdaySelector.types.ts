/**
 * WeekdaySelector Component Types
 */

export interface WeekdaySelectorProps {
  selectedDays: number[];
  onChange: (days: number[]) => void;
  label?: string;
  required?: boolean;
}
