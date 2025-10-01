/**
 * Custom Hook for Medication Management
 * Handles CRUD operations for medications
 */

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/services/storage/database';
import type { Medication } from '@/types';

export function useMedications() {
  const medications = useLiveQuery(() => db.medications.toArray()) ?? [];

  const addMedication = async (medication: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const now = new Date();
    const id = crypto.randomUUID();

    await db.medications.add({
      ...medication,
      id,
      createdAt: now,
      updatedAt: now
    });

    return id;
  };

  const updateMedication = async (id: string, updates: Partial<Medication>): Promise<void> => {
    await db.medications.update(id, {
      ...updates,
      updatedAt: new Date()
    });
  };

  const deleteMedication = async (id: string): Promise<void> => {
    // Delete medication and all associated schedules and intakes
    await db.transaction('rw', [db.medications, db.schedules, db.intakes], async () => {
      await db.medications.delete(id);
      await db.schedules.where('medicationId').equals(id).delete();
      await db.intakes.where('medicationId').equals(id).delete();
    });
  };

  const getMedicationById = async (id: string): Promise<Medication | undefined> => {
    return await db.medications.get(id);
  };

  return {
    medications,
    addMedication,
    updateMedication,
    deleteMedication,
    getMedicationById
  };
}
