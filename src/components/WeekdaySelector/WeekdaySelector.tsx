/**
 * WeekdaySelector Component
 * Multi-select weekday picker with large touch targets
 */

import React from 'react';
import { DAYS_OF_WEEK_SHORT } from '@/constants';
import type { WeekdaySelectorProps } from './WeekdaySelector.types';

export const WeekdaySelector: React.FC<WeekdaySelectorProps> = ({
  selectedDays,
  onChange,
  label,
  required = false
}) => {
  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter(d => d !== day));
    } else {
      onChange([...selectedDays, day].sort());
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-senior-lg font-semibold">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}

      <div className="grid grid-cols-7 gap-2">
        {DAYS_OF_WEEK_SHORT.map((day, index) => {
          const isSelected = selectedDays.includes(index);

          return (
            <button
              key={index}
              type="button"
              onClick={() => toggleDay(index)}
              className={`
                px-3 py-4 text-senior-base font-semibold rounded-lg border-2 transition-all
                ${isSelected
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {selectedDays.length === 0 && required && (
        <p className="text-senior-sm text-red-600">
          Bitte mindestens einen Tag auswählen
        </p>
      )}
    </div>
  );
};
