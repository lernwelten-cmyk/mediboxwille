/**
 * Medication Detail Component
 * Shows medication details and schedule management
 */

import React, { useState, useEffect } from 'react';
import { useMedications } from '@/hooks/useMedications';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ScheduleManager } from '@/features/schedule/ScheduleManager';
import type { Medication } from '@/types';

interface MedicationDetailProps {
  medicationId: string;
  onBack: () => void;
}

export const MedicationDetail: React.FC<MedicationDetailProps> = ({
  medicationId,
  onBack
}) => {
  const { getMedicationById } = useMedications();
  const [medication, setMedication] = useState<Medication | null>(null);

  useEffect(() => {
    loadMedication();
  }, [medicationId]);

  const loadMedication = async () => {
    const med = await getMedicationById(medicationId);
    if (med) {
      setMedication(med);
    }
  };

  if (!medication) {
    return (
      <div className="space-y-6">
        <Button variant="secondary" onClick={onBack} icon="←">
          Zurück
        </Button>
        <Card padding="large">
          <p className="text-senior-lg text-center text-gray-500">
            Medikament nicht gefunden
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="secondary" onClick={onBack} icon="←" size="large">
        Zurück zu Medikamente
      </Button>

      {/* Medication Info */}
      <Card padding="large">
        <div className="flex items-start gap-4">
          {medication.color && (
            <div
              className="w-16 h-16 rounded-full border-2 border-gray-300 flex-shrink-0"
              style={{ backgroundColor: medication.color }}
            />
          )}
          <div className="flex-1">
            <h1 className="text-senior-2xl font-bold mb-2">
              {medication.name}
            </h1>
            <p className="text-senior-xl text-gray-700 mb-2">
              {medication.dosage}
            </p>
            {medication.description && (
              <p className="text-senior-lg text-gray-600 mb-2">
                {medication.description}
              </p>
            )}
            {medication.stock !== undefined && (
              <p className="text-senior-lg text-gray-600">
                📦 Bestand: <span className="font-semibold">{medication.stock} Stück</span>
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Schedule Management */}
      <ScheduleManager
        medicationId={medication.id}
        medicationName={medication.name}
      />
    </div>
  );
};
