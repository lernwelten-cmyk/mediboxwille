/**
 * Medication Form Component
 * Form for adding/editing medications
 */

import React, { useState, useEffect } from 'react';
import { useMedications } from '@/hooks/useMedications';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';

interface MedicationFormProps {
  medicationId?: string | null;
  onClose: () => void;
}

export const MedicationForm: React.FC<MedicationFormProps> = ({
  medicationId,
  onClose
}) => {
  const { addMedication, updateMedication, getMedicationById } = useMedications();

  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (medicationId) {
      loadMedication();
    }
  }, [medicationId]);

  const loadMedication = async () => {
    if (!medicationId) return;

    const medication = await getMedicationById(medicationId);
    if (medication) {
      setFormData({
        name: medication.name,
        dosage: medication.dosage,
        description: medication.description || ''
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        name: formData.name,
        dosage: formData.dosage,
        description: formData.description || undefined
      };

      if (medicationId) {
        await updateMedication(medicationId, data);
      } else {
        await addMedication(data);
      }

      onClose();
    } catch (error) {
      console.error('Error saving medication:', error);
      alert('Fehler beim Speichern des Medikaments');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={medicationId ? 'Medikament bearbeiten' : 'Neues Medikament'}
      size="large"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-senior-lg font-semibold mb-2">
            Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-6 py-4 text-senior-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="z.B. Aspirin"
          />
        </div>

        {/* Dosage */}
        <div>
          <label className="block text-senior-lg font-semibold mb-2">
            Dosierung *
          </label>
          <input
            type="text"
            required
            value={formData.dosage}
            onChange={(e) => handleChange('dosage', e.target.value)}
            className="w-full px-6 py-4 text-senior-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="z.B. 100mg"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-senior-lg font-semibold mb-2">
            Beschreibung (optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full px-6 py-4 text-senior-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="z.B. Gegen Kopfschmerzen"
            rows={3}
          />
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
