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
      // Get all schedules first for debugging
      const allSchedules = await db.schedules.toArray();
      console.log(`📅 Total schedules in DB: ${allSchedules.length}`, allSchedules);
      console.log(`📅 Today is day: ${dayOfWeek} (0=Sunday, 1=Monday, etc.)`);

      // Get all active schedules for today's weekday
      const activeSchedules = await db.schedules
        .filter(schedule =>
          schedule.isActive &&
          schedule.daysOfWeek.includes(dayOfWeek)
        )
        .toArray();

      console.log(`📅 Active schedules for today: ${activeSchedules.length}`, activeSchedules);

      // Check which intakes already exist for today
      const existingIntakes = await db.intakes
        .filter(intake => {
          const intakeDate = new Date(intake.plannedTime);
          return intakeDate >= today && intakeDate < tomorrow;
        })
        .toArray();

      console.log(`📅 Existing intakes for today: ${existingIntakes.length}`, existingIntakes);

      const existingIntakesBySchedule = new Map(
        existingIntakes.map(i => [i.scheduleId, i])
      );

      // Create new intakes or update existing ones
      let created = 0;
      let updated = 0;
      for (const schedule of activeSchedules) {
        const existingIntake = existingIntakesBySchedule.get(schedule.id);

        if (!existingIntake) {
          // No intake exists yet - create new one
          await this.createIntakeForSchedule(schedule, today);
          created++;
        } else {
          // Intake exists - check if time matches schedule
          const [hours, minutes] = schedule.time.split(':').map(Number);
          const expectedTime = new Date(today);
          expectedTime.setHours(hours, minutes, 0, 0);

          const existingTime = new Date(existingIntake.plannedTime);

          // If times don't match, update the intake (unless already completed)
          if (existingTime.getTime() !== expectedTime.getTime() &&
              existingIntake.status !== 'completed') {
            const now = new Date();
            const status: 'pending' | 'missed' = expectedTime < now ? 'missed' : 'pending';

            await db.intakes.update(existingIntake.id, {
              plannedTime: expectedTime,
              status
            });
            updated++;
            console.log(`🔄 Updated intake time for schedule ${schedule.id}`);
          }
        }
      }

      console.log(`✅ Generated ${created} new intakes, updated ${updated} existing intakes for today`);
    } catch (error) {
      console.error('❌ Error generating daily intakes:', error);
    }
  }

  /**
   * Create a single intake entry for a schedule
   */
  private async createIntakeForSchedule(schedule: Schedule, date: Date): Promise<void> {
    const [hours, minutes] = schedule.time.split(':').map(Number);
    const plannedTime = new Date(date);
    plannedTime.setHours(hours, minutes, 0, 0);

    const id = crypto.randomUUID();
    const now = new Date();

    // Determine status based on current time
    const status: 'pending' | 'missed' = plannedTime < now ? 'missed' : 'pending';

    const intake = {
      id,
      medicationId: schedule.medicationId,
      scheduleId: schedule.id,
      plannedTime,
      status,
      createdAt: new Date()
    };

    console.log('➕ Creating intake:', intake);

    await db.intakes.add(intake);
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
