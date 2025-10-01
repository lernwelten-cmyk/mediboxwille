/**
 * TimePicker Component Types
 */

export interface TimePickerProps {
  value: string; // HH:mm format
  onChange: (time: string) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}
