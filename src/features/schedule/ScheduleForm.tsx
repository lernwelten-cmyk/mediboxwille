/**
 * Schedule Form Component
 * Form for adding/editing medication intake schedules with fasting periods
 */

import React, { useState, useEffect } from 'react';
import { useSchedule } from '@/hooks/useSchedule';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { TimePicker } from '@/components/TimePicker';
import { WeekdaySelector } from '@/components/WeekdaySelector';
import { FASTING_DURATIONS } from '@/constants';

interface ScheduleFormProps {
  medicationId: string;
  scheduleId?: string | null;
  onClose: () => void;
}

export const ScheduleForm: React.FC<ScheduleFormProps> = ({
  medicationId,
  scheduleId,
  onClose
}) => {
  const { addSchedule, updateSchedule, schedules } = useSchedule();

  const [formData, setFormData] = useState({
    time: '08:00',
    daysOfWeek: [1, 2, 3, 4, 5, 6, 0], // All days selected by default
    fastingBefore: 0,
    fastingAfter: 0,
    isActive: true
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (scheduleId) {
      loadSchedule();
    }
  }, [scheduleId]);

  const loadSchedule = async () => {
    const schedule = schedules.find(s => s.id === scheduleId);
    if (schedule) {
      setFormData({
        time: schedule.time,
        daysOfWeek: schedule.daysOfWeek,
        fastingBefore: schedule.fastingBefore || 0,
        fastingAfter: schedule.fastingAfter || 0,
        isActive: schedule.isActive
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.daysOfWeek.length === 0) {
      alert('Bitte wählen Sie mindestens einen Tag aus');
      return;
    }

    setLoading(true);

    try {
      const data = {
        medicationId,
        time: formData.time,
        daysOfWeek: formData.daysOfWeek,
        isActive: formData.isActive,
        fastingBefore: formData.fastingBefore || undefined,
        fastingAfter: formData.fastingAfter || undefined
      };

      if (scheduleId) {
        await updateSchedule(scheduleId, data);
      } else {
        await addSchedule(data);
      }

      onClose();
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Fehler beim Speichern der Einnahme-Zeit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={scheduleId ? 'Einnahme-Zeit bearbeiten' : 'Neue Einnahme-Zeit'}
      size="large"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Time Picker */}
        <TimePicker
          value={formData.time}
          onChange={(time) => setFormData(prev => ({ ...prev, time }))}
          label="Uhrzeit"
          required
        />

        {/* Weekday Selector */}
        <WeekdaySelector
          selectedDays={formData.daysOfWeek}
          onChange={(days) => setFormData(prev => ({ ...prev, daysOfWeek: days }))}
          label="Wochentage"
          required
        />

        {/* Fasting Before */}
        <div>
          <label className="block text-senior-lg font-semibold mb-2">
            Nüchtern vor Einnahme
          </label>
          <select
            value={formData.fastingBefore}
            onChange={(e) => setFormData(prev => ({ ...prev, fastingBefore: parseInt(e.target.value) }))}
            className="w-full px-6 py-4 text-senior-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          >
            <option value="0">Keine Einschränkung</option>
            {FASTING_DURATIONS.map(duration => (
              <option key={`before-${duration.value}`} value={duration.value}>
                {duration.label} vorher nüchtern
              </option>
            ))}
          </select>
          {formData.fastingBefore > 0 && (
            <p className="mt-2 text-senior-base text-gray-600">
              ⚠️ Sie erhalten {formData.fastingBefore} Min vorher eine Erinnerung: "Nicht mehr essen!"
            </p>
          )}
        </div>

        {/* Fasting After */}
        <div>
          <label className="block text-senior-lg font-semibold mb-2">
            Nüchtern nach Einnahme
          </label>
          <select
            value={formData.fastingAfter}
            onChange={(e) => setFormData(prev => ({ ...prev, fastingAfter: parseInt(e.target.value) }))}
            className="w-full px-6 py-4 text-senior-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          >
            <option value="0">Keine Einschränkung</option>
            {FASTING_DURATIONS.map(duration => (
              <option key={`after-${duration.value}`} value={duration.value}>
                {duration.label} danach nüchtern
              </option>
            ))}
          </select>
          {formData.fastingAfter > 0 && (
            <p className="mt-2 text-senior-base text-gray-600">
              ✅ Sie erhalten {formData.fastingAfter} Min nach Einnahme eine Erinnerung: "Sie können wieder essen!"
            </p>
          )}
        </div>

        {/* Active Toggle */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
            className="w-8 h-8 rounded border-2 border-gray-300"
          />
          <label htmlFor="isActive" className="text-senior-lg font-semibold">
            Aktiv (Erinnerungen erhalten)
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="secondary"
            size="large"
            onClick={onClose}
            fullWidth
          >
            Abbrechen
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="large"
            disabled={loading}
            fullWidth
          >
            {loading ? 'Speichern...' : 'Speichern'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
