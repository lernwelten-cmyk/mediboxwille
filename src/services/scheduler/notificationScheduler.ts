/**
 * Notification Scheduler Service
 * Schedules push notifications for medication intakes and fasting periods
 */

import { db } from '@/services/storage/database';
import { notificationService } from '@/services/notifications/notificationService';
import type { Intake } from '@/types';

class NotificationScheduler {
  private static instance: NotificationScheduler;
  private scheduledTimeouts: Map<string, number[]> = new Map();

  private constructor() {}

  static getInstance(): NotificationScheduler {
    if (!NotificationScheduler.instance) {
      NotificationScheduler.instance = new NotificationScheduler();
    }
    return NotificationScheduler.instance;
  }

  /**
   * Schedule all notifications for upcoming intakes
   */
  async scheduleUpcomingNotifications(): Promise<void> {
    if (!notificationService.isSupported()) {
      console.log('⚠️ Notifications not supported');
      return;
    }

    // Clear existing timeouts
    this.clearAllTimeouts();

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);

    // Get all pending intakes for today and tomorrow
    const upcomingIntakes = await db.intakes
      .filter(intake =>
        intake.status === 'pending' &&
        new Date(intake.plannedTime) > now &&
        new Date(intake.plannedTime) <= tomorrow
      )
      .toArray();

    console.log(`📅 Scheduling notifications for ${upcomingIntakes.length} upcoming intakes`);

    for (const intake of upcomingIntakes) {
      await this.scheduleIntakeNotifications(intake);
    }
  }

  /**
   * Schedule all notifications for a single intake
   */
  private async scheduleIntakeNotifications(intake: Intake): Promise<void> {
    const schedule = await db.schedules.get(intake.scheduleId);
    const medication = await db.medications.get(intake.medicationId);

    if (!schedule || !medication) return;

    const intakeTime = new Date(intake.plannedTime);
    const now = new Date();
    const timeouts: number[] = [];

    // 1. Fasting start notification (before intake)
    if (schedule.fastingBefore && schedule.fastingBefore > 0) {
      const fastingStartTime = new Date(intakeTime.getTime() - schedule.fastingBefore * 60000);

      if (fastingStartTime > now) {
        const delay = fastingStartTime.getTime() - now.getTime();
        const timeoutId = window.setTimeout(() => {
          notificationService.sendFastingStartNotification(
            medication.name,
            schedule.fastingBefore!
          );
        }, delay);
        timeouts.push(timeoutId);
      }
    }

    // 2. Upcoming reminder (15 minutes before)
    const reminderTime = new Date(intakeTime.getTime() - 15 * 60000);
    if (reminderTime > now) {
      const delay = reminderTime.getTime() - now.getTime();
      const timeoutId = window.setTimeout(() => {
        notificationService.sendUpcomingReminder(medication.name, 15);
      }, delay);
      timeouts.push(timeoutId);
    }

    // 3. Intake time notification
    if (intakeTime > now) {
      const delay = intakeTime.getTime() - now.getTime();
      const timeoutId = window.setTimeout(() => {
        notificationService.sendMedicationReminder(
          medication.name,
          schedule.time
        );
      }, delay);
      timeouts.push(timeoutId);
    }

    // 4. Fasting end notification (after intake)
    // This will be triggered when user marks intake as completed
    // See markIntakeCompletedWithNotification method

    if (timeouts.length > 0) {
      this.scheduledTimeouts.set(intake.id, timeouts);
    }
  }

  /**
   * Mark intake as completed and schedule fasting end notification
   */
  async markIntakeCompletedWithNotification(intakeId: string): Promise<void> {
    const intake = await db.intakes.get(intakeId);
    if (!intake) return;

    const schedule = await db.schedules.get(intake.scheduleId);
    const medication = await db.medications.get(intake.medicationId);

    if (!schedule || !medication) return;

    // Mark as completed
    await db.intakes.update(intakeId, {
      status: 'completed',
      actualTime: new Date()
    });

    // Decrement stock if tracked
    if (medication.stock !== undefined && medication.stock > 0) {
      const newStock = medication.stock - 1;
      await db.medications.update(medication.id, { stock: newStock });

      // Low stock warning
      if (medication.lowStockThreshold && newStock <= medication.lowStockThreshold) {
        notificationService.sendLowStockWarning(medication.name, newStock);
      }
    }

    // Schedule fasting end notification
    if (schedule.fastingAfter && schedule.fastingAfter > 0) {
      const fastingEndTime = new Date(Date.now() + schedule.fastingAfter * 60000);
      const delay = fastingEndTime.getTime() - Date.now();

      setTimeout(() => {
        notificationService.sendFastingEndNotification(medication.name);
      }, delay);
    } else {
      // No fasting required, notify immediately
      notificationService.sendFastingEndNotification(medication.name);
    }

    // Remove scheduled timeouts for this intake
    this.clearIntakeTimeouts(intakeId);
  }

  /**
   * Clear timeouts for a specific intake
   */
  private clearIntakeTimeouts(intakeId: string): void {
    const timeouts = this.scheduledTimeouts.get(intakeId);
    if (timeouts) {
      timeouts.forEach(timeoutId => clearTimeout(timeoutId));
      this.scheduledTimeouts.delete(intakeId);
    }
  }

  /**
   * Clear all scheduled timeouts
   */
  private clearAllTimeouts(): void {
    this.scheduledTimeouts.forEach(timeouts => {
      timeouts.forEach(timeoutId => clearTimeout(timeoutId));
    });
    this.scheduledTimeouts.clear();
  }

  /**
   * Start automatic notification scheduling
   */
  startAutoScheduling(): void {
    // Schedule notifications immediately
    this.scheduleUpcomingNotifications();

    // Re-schedule every hour to catch new intakes
    setInterval(() => {
      this.scheduleUpcomingNotifications();
    }, 60 * 60 * 1000);

    console.log('🔔 Notification scheduler started');
  }

  /**
   * Manually refresh scheduled notifications (for testing)
   */
  async manualRefresh(): Promise<void> {
    await this.scheduleUpcomingNotifications();
  }
}

export const notificationScheduler = NotificationScheduler.getInstance();
