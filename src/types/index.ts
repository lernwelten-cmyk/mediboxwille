/**
 * Global TypeScript Types for MediBox
 */

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  color?: string;
  shape?: string;
  imageUrl?: string;
  description?: string;
  stock?: number;
  lowStockThreshold?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Schedule {
  id: string;
  medicationId: string;
  time: string; // HH:mm format
  daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
  isActive: boolean;
  fastingBefore?: number; // minutes before meal restriction starts
  fastingAfter?: number; // minutes after meal restriction ends
  createdAt: Date;
  updatedAt: Date;
}

export interface Intake {
  id: string;
  medicationId: string;
  scheduleId: string;
  plannedTime: Date;
  actualTime?: Date;
  status: 'pending' | 'completed' | 'missed' | 'snoozed';
  snoozedUntil?: Date;
  notes?: string;
  createdAt: Date;
}

export interface FastingPeriod {
  medicationId: string;
  scheduledIntakeTime: Date;
  fastingStartTime: Date; // When to stop eating
  fastingEndTime: Date; // When eating is allowed again
  status: 'upcoming' | 'active' | 'completed';
}

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibrate: boolean;
  reminderMinutesBefore: number[];
}

export interface AppSettings {
  fontSize: 'normal' | 'large' | 'extra-large';
  highContrast: boolean;
  nightMode: boolean;
  notifications: NotificationSettings;
}

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;
