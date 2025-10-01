/**
 * TimePicker Component
 * Senior-friendly time input with large controls
 */

import React from 'react';
import type { TimePickerProps } from './TimePicker.types';

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  label,
  required = false,
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-senior-lg font-semibold">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        className="w-full px-6 py-4 text-senior-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:bg-gray-100"
      />
    </div>
  );
};
