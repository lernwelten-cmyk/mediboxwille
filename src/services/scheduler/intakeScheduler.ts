/**
 * Intake Scheduler Service
 * Automatically generates daily intake entries based on active schedules
 */

import { db } from '@/services/storage/database';
import type { Schedule } from '@/types';

class IntakeScheduler {
  private static instance: IntakeScheduler;

  private constructor() {}

  static getInstance(): IntakeScheduler {
    if (!IntakeScheduler.instance) {
      IntakeScheduler.instance = new IntakeScheduler();
    }
    return IntakeScheduler.instance;
  }

  /**
   * Generate intake entries for today based on active schedules
   */
  async generateTodaysIntakes(): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dayOfWeek = today.getDay();

    try {
      // Get all active schedules for today's weekday
      const activeSchedules = await db.schedules
        .filter(schedule =>
          schedule.isActive &&
          schedule.daysOfWeek.includes(dayOfWeek)
        )
        .toArray();

      // Check which intakes already exist for today
      const existingIntakes = await db.intakes
        .filter(intake => {
          const intakeDate = new Date(intake.plannedTime);
          return intakeDate >= today && intakeDate < tomorrow;
        })
        .toArray();

      const existingScheduleIds = new Set(existingIntakes.map(i => i.scheduleId));

      // Create new intakes for schedules that don't have one yet
      for (const schedule of activeSchedules) {
        if (!existingScheduleIds.has(schedule.id)) {
          await this.createIntakeForSchedule(schedule, today);
        }
      }

      console.log(`✅ Generated ${activeSchedules.length - existingScheduleIds.size} new intakes for today`);
    } catch (error) {
      console.error('Error generating daily intakes:', error);
    }
  }

  /**
   * Create a single intake entry for a schedule
   */
  private async createIntakeForSchedule(schedule: Schedule, date: Date): Promise<void> {
    const [hours, minutes] = schedule.time.split(':').map(Number);
    const plannedTime = new Date(date);
    plannedTime.setHours(hours, minutes, 0, 0);

    // Only create if time hasn't passed yet
    if (plannedTime > new Date()) {
      const id = crypto.randomUUID();

      await db.intakes.add({
        id,
        medicationId: schedule.medicationId,
        scheduleId: schedule.id,
        plannedTime,
        status: 'pending',
        createdAt: new Date()
      });
    }
  }

  /**
   * Start automatic daily scheduling
   * Runs at app startup and every 24 hours
   */
  startAutoScheduling(): void {
    // Generate intakes immediately
    this.generateTodaysIntakes();

    // Calculate time until midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 1, 0, 0); // 00:01 next day

    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    // Schedule first run at midnight
    setTimeout(() => {
      this.generateTodaysIntakes();

      // Then run every 24 hours
      setInterval(() => {
        this.generateTodaysIntakes();
      }, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);

    console.log('📅 Intake scheduler started');
  }

  /**
   * Manually trigger intake generation (for testing)
   */
  async manualGenerate(): Promise<void> {
    await this.generateTodaysIntakes();
  }
}

export const intakeScheduler = IntakeScheduler.getInstance();
