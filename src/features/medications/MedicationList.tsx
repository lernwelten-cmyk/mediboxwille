/**
 * Medication List Component
 * Displays all medications with search functionality
 */

import React, { useState } from 'react';
import { useMedications } from '@/hooks/useMedications';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { MedicationForm } from './MedicationForm';

export const MedicationList: React.FC = () => {
  const { medications, deleteMedication } = useMedications();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredMedications = medications.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: string) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Möchten Sie dieses Medikament wirklich löschen?')) {
      await deleteMedication(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h1 className="text-senior-2xl font-bold">Meine Medikamente</h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Medikament suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-6 py-4 text-senior-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        />

        {/* Add Button */}
        <Button
          variant="primary"
          icon="+"
          onClick={() => setShowForm(true)}
          fullWidth
        >
          Neues Medikament
        </Button>
      </div>

      {/* Medication List */}
      <div className="space-y-4">
        {filteredMedications.length === 0 ? (
          <Card padding="large">
            <p className="text-senior-lg text-center text-gray-500">
              {searchTerm ? 'Keine Medikamente gefunden' : 'Noch keine Medikamente hinzugefügt'}
            </p>
          </Card>
        ) : (
          filteredMedications.map(medication => (
            <Card key={medication.id} padding="large">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {/* Color indicator */}
                    {medication.color && (
                      <div
                        className="w-8 h-8 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: medication.color }}
                      />
                    )}
                    <h3 className="text-senior-xl font-bold">{medication.name}</h3>
                  </div>

                  <p className="text-senior-lg text-gray-700 mb-2">
                    {medication.dosage}
                  </p>

                  {medication.description && (
                    <p className="text-senior-base text-gray-600">
                      {medication.description}
                    </p>
                  )}

                  {medication.stock !== undefined && (
                    <p className="text-senior-base text-gray-600 mt-2">
                      Bestand: {medication.stock} Stück
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => handleEdit(medication.id)}
                  >
                    ✏️
                  </Button>
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => handleDelete(medication.id)}
                  >
                    🗑️
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <MedicationForm
          medicationId={editingId}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};
