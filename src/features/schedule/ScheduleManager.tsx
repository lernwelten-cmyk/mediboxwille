/**
 * Schedule Manager Component
 * Manages all intake schedules for a specific medication
 */

import React, { useState, useEffect } from 'react';
import { useSchedule } from '@/hooks/useSchedule';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ScheduleForm } from './ScheduleForm';
import { DAYS_OF_WEEK_SHORT } from '@/constants';
import type { Schedule } from '@/types';

interface ScheduleManagerProps {
  medicationId: string;
  medicationName: string;
}

export const ScheduleManager: React.FC<ScheduleManagerProps> = ({
  medicationId,
  medicationName
}) => {
  const { schedules, deleteSchedule, toggleScheduleActive } = useSchedule();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [medicationSchedules, setMedicationSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    // Filter schedules for this medication
    const filtered = schedules.filter(s => s.medicationId === medicationId);
    setMedicationSchedules(filtered);
  }, [schedules, medicationId]);

  const handleEdit = (id: string) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Möchten Sie diese Einnahme-Zeit wirklich löschen?')) {
      await deleteSchedule(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const formatDays = (daysOfWeek: number[]): string => {
    if (daysOfWeek.length === 7) {
      return 'Täglich';
    }
    if (daysOfWeek.length === 5 && !daysOfWeek.includes(0) && !daysOfWeek.includes(6)) {
      return 'Mo-Fr';
    }
    if (daysOfWeek.length === 2 && daysOfWeek.includes(0) && daysOfWeek.includes(6)) {
      return 'Wochenende';
    }

    return daysOfWeek
      .sort()
      .map(day => DAYS_OF_WEEK_SHORT[day])
      .join(', ');
  };

  const formatFasting = (schedule: Schedule): string | null => {
    const parts: string[] = [];

    if (schedule.fastingBefore) {
      parts.push(`${schedule.fastingBefore} Min vorher nüchtern`);
    }
    if (schedule.fastingAfter) {
      parts.push(`${schedule.fastingAfter} Min danach nüchtern`);
    }

    return parts.length > 0 ? parts.join(' • ') : null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-senior-xl font-bold mb-2">
          Einnahme-Zeiten für {medicationName}
        </h2>
        <p className="text-senior-base text-gray-600">
          Legen Sie fest, wann Sie dieses Medikament einnehmen möchten
        </p>
      </div>

      {/* Add Button */}
      <Button
        variant="primary"
        icon="+"
        onClick={() => setShowForm(true)}
        fullWidth
      >
        Neue Einnahme-Zeit
      </Button>

      {/* Schedule List */}
      <div className="space-y-4">
        {medicationSchedules.length === 0 ? (
          <Card padding="large">
            <p className="text-senior-lg text-center text-gray-500">
              Noch keine Einnahme-Zeiten festgelegt
            </p>
          </Card>
        ) : (
          medicationSchedules.map(schedule => {
            const fastingInfo = formatFasting(schedule);

            return (
              <Card
                key={schedule.id}
                padding="large"
                className={!schedule.isActive ? 'opacity-50' : ''}
              >
                <div className="space-y-3">
                  {/* Time and Days */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-senior-2xl font-bold text-blue-600">
                          {schedule.time}
                        </span>
                        {!schedule.isActive && (
                          <span className="text-senior-base text-gray-500 font-semibold">
                            (Inaktiv)
                          </span>
                        )}
                      </div>
                      <p className="text-senior-lg text-gray-700">
                        {formatDays(schedule.daysOfWeek)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleEdit(schedule.id)}
                      >
                        ✏️
                      </Button>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleDelete(schedule.id)}
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>

                  {/* Fasting Info */}
                  {fastingInfo && (
                    <div className="p-3 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                      <p className="text-senior-base text-gray-700">
                        🍽️ {fastingInfo}
                      </p>
                    </div>
                  )}

                  {/* Active Toggle */}
                  <Button
                    variant={schedule.isActive ? 'secondary' : 'success'}
                    size="medium"
                    onClick={() => toggleScheduleActive(schedule.id)}
                    fullWidth
                  >
                    {schedule.isActive ? '⏸️ Pausieren' : '▶️ Aktivieren'}
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <ScheduleForm
          medicationId={medicationId}
          scheduleId={editingId}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};
