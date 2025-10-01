/**
 * Medication Form Component
 * Form for adding/editing medications
 */

import React, { useState, useEffect } from 'react';
import { useMedications } from '@/hooks/useMedications';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { MEDICATION_COLORS } from '@/constants';

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
    color: '',
    description: '',
    stock: '',
    lowStockThreshold: '10'
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
        color: medication.color || '',
        description: medication.description || '',
        stock: medication.stock?.toString() || '',
        lowStockThreshold: medication.lowStockThreshold?.toString() || '10'
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
        color: formData.color || undefined,
        description: formData.description || undefined,
        stock: formData.stock ? parseInt(formData.stock) : undefined,
        lowStockThreshold: formData.lowStockThreshold ? parseInt(formData.lowStockThreshold) : undefined
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

        {/* Color */}
        <div>
          <label className="block text-senior-lg font-semibold mb-2">
            Farbe (optional)
          </label>
          <div className="grid grid-cols-4 gap-3">
            {MEDICATION_COLORS.map(color => (
              <button
                key={color.value}
                type="button"
                onClick={() => handleChange('color', color.hex)}
                className={`p-4 rounded-lg border-4 transition-all ${
                  formData.color === color.hex
                    ? 'border-blue-600 scale-105'
                    : 'border-gray-300'
                }`}
                style={{ backgroundColor: color.hex }}
              >
                <span className="text-senior-base font-semibold">
                  {color.label}
                </span>
              </button>
            ))}
          </div>
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

        {/* Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-senior-lg font-semibold mb-2">
              Bestand (optional)
            </label>
            <input
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => handleChange('stock', e.target.value)}
              className="w-full px-6 py-4 text-senior-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="Anzahl"
            />
          </div>
          <div>
            <label className="block text-senior-lg font-semibold mb-2">
              Warnung bei
            </label>
            <input
              type="number"
              min="1"
              value={formData.lowStockThreshold}
              onChange={(e) => handleChange('lowStockThreshold', e.target.value)}
              className="w-full px-6 py-4 text-senior-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
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
