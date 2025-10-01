/**
 * IndexedDB Database Configuration using Dexie
 * Handles offline storage for all app data
 */

import Dexie, { Table } from 'dexie';
import type { Medication, Schedule, Intake, AppSettings } from '@/types';

export class MediBoxDatabase extends Dexie {
  medications!: Table<Medication, string>;
  schedules!: Table<Schedule, string>;
  intakes!: Table<Intake, string>;
  settings!: Table<AppSettings & { id: string }, string>;

  constructor() {
    super('MediBoxDB');

    this.version(1).stores({
      medications: 'id, name, createdAt',
      schedules: 'id, medicationId, time, isActive',
      intakes: 'id, medicationId, scheduleId, plannedTime, status',
      settings: 'id'
    });
  }
}

export const db = new MediBoxDatabase();

// Initialize default settings
export async function initializeSettings(): Promise<void> {
  const existingSettings = await db.settings.get('default');

  if (!existingSettings) {
    await db.settings.add({
      id: 'default',
      fontSize: 'large',
      highContrast: true,
      nightMode: false,
      notifications: {
        enabled: true,
        sound: true,
        vibrate: true,
        reminderMinutesBefore: [30, 15, 5]
      }
    });
  }
}
