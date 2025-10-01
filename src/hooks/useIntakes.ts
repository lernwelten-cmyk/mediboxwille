/**
 * Custom Hook for Intake Management
 * Handles medication intake tracking and history
 */

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/services/storage/database';
import type { Intake } from '@/types';

export function useIntakes() {
  const intakes = useLiveQuery(() => db.intakes.toArray()) ?? [];

  const addIntake = async (intake: Omit<Intake, 'id' | 'createdAt'>): Promise<string> => {
    const id = crypto.randomUUID();

    await db.intakes.add({
      ...intake,
      id,
      createdAt: new Date()
    });

    return id;
  };

  const markIntakeCompleted = async (id: string): Promise<void> => {
    await db.intakes.update(id, {
      status: 'completed',
      actualTime: new Date()
    });
  };

  const markIntakeMissed = async (id: string): Promise<void> => {
    await db.intakes.update(id, {
      status: 'missed'
    });
  };

  const snoozeIntake = async (id: string, minutes: number): Promise<void> => {
    const snoozedUntil = new Date(Date.now() + minutes * 60 * 1000);
    await db.intakes.update(id, {
      status: 'snoozed',
      snoozedUntil
    });
  };

  const getTodaysIntakes = (): Intake[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return intakes.filter(intake => {
      const intakeDate = new Date(intake.plannedTime);
      return intakeDate >= today && intakeDate < tomorrow;
    });
  };

  const getUpcomingIntakes = (): Intake[] => {
    const now = new Date();
    return intakes
      .filter(intake =>
        intake.status === 'pending' &&
        new Date(intake.plannedTime) > now
      )
      .sort((a, b) => new Date(a.plannedTime).getTime() - new Date(b.plannedTime).getTime());
  };

  const getIntakeStats = (startDate: Date, endDate: Date) => {
    const periodIntakes = intakes.filter(intake => {
      const intakeDate = new Date(intake.plannedTime);
      return intakeDate >= startDate && intakeDate <= endDate;
    });

    const completed = periodIntakes.filter(i => i.status === 'completed').length;
    const missed = periodIntakes.filter(i => i.status === 'missed').length;
    const total = periodIntakes.length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return {
      total,
      completed,
      missed,
      completionRate
    };
  };

  return {
    intakes,
    addIntake,
    markIntakeCompleted,
    markIntakeMissed,
    snoozeIntake,
    getTodaysIntakes,
    getUpcomingIntakes,
    getIntakeStats
  };
}
