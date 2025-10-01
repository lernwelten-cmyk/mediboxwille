/**
 * Custom Hook for Schedule Management
 * Handles medication intake schedules
 */

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/services/storage/database';
import type { Schedule } from '@/types';

export function useSchedule() {
  const schedules = useLiveQuery(() => db.schedules.toArray()) ?? [];

  const addSchedule = async (schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const now = new Date();
    const id = crypto.randomUUID();

    await db.schedules.add({
      ...schedule,
      id,
      createdAt: now,
      updatedAt: now
    });

    return id;
  };

  const updateSchedule = async (id: string, updates: Partial<Schedule>): Promise<void> => {
    await db.schedules.update(id, {
      ...updates,
      updatedAt: new Date()
    });
  };

  const deleteSchedule = async (id: string): Promise<void> => {
    await db.transaction('rw', [db.schedules, db.intakes], async () => {
      await db.schedules.delete(id);
      await db.intakes.where('scheduleId').equals(id).delete();
    });
  };

  const getSchedulesForMedication = async (medicationId: string): Promise<Schedule[]> => {
    return await db.schedules.where('medicationId').equals(medicationId).toArray();
  };

  const toggleScheduleActive = async (id: string): Promise<void> => {
    const schedule = await db.schedules.get(id);
    if (schedule) {
      await updateSchedule(id, { isActive: !schedule.isActive });
    }
  };

  return {
    schedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    getSchedulesForMedication,
    toggleScheduleActive
  };
}
