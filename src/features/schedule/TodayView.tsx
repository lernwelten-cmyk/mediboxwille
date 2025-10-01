/**
 * Today View Component
 * Shows today's medication schedule with intake tracking
 */

import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/services/storage/database';
import { useMedications } from '@/hooks/useMedications';
import { useIntakes } from '@/hooks/useIntakes';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { notificationScheduler } from '@/services/scheduler/notificationScheduler';
import { SNOOZE_DURATIONS } from '@/constants';
import type { Intake } from '@/types';

export const TodayView: React.FC = () => {
  const { medications } = useMedications();
  const { snoozeIntake } = useIntakes();

  // Use useLiveQuery to get real-time updates from IndexedDB
  const allIntakes = useLiveQuery(() => db.intakes.toArray()) ?? [];

  // Filter for today's intakes
  const todaysIntakes = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return allIntakes.filter(intake => {
      const intakeDate = new Date(intake.plannedTime);
      return intakeDate >= today && intakeDate < tomorrow;
    });
  }, [allIntakes]);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update current time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleComplete = async (intake: Intake) => {
    // Use notificationScheduler which handles completion + fasting notifications
    await notificationScheduler.markIntakeCompletedWithNotification(intake.id);
    // useLiveQuery will automatically update the view
  };

  const handleSnooze = async (intakeId: string, minutes: number) => {
    await snoozeIntake(intakeId, minutes);
    // useLiveQuery will automatically update the view
  };

  const formatTime = (date: Date): string => {
    return new Date(date).toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (plannedTime: Date): boolean => {
    return new Date(plannedTime) < currentTime;
  };

  const sortedIntakes = [...todaysIntakes].sort((a, b) =>
    new Date(a.plannedTime).getTime() - new Date(b.plannedTime).getTime()
  );

  const pendingIntakes = sortedIntakes.filter(i => i.status === 'pending' || i.status === 'snoozed');
  const completedIntakes = sortedIntakes.filter(i => i.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-senior-2xl font-bold mb-2">Heute</h1>
        <p className="text-senior-lg text-gray-600">
          {new Date().toLocaleDateString('de-DE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* Pending Intakes */}
      {pendingIntakes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-senior-xl font-bold">Anstehend</h2>
          {pendingIntakes.map(intake => {
            const medication = medications.find(m => m.id === intake.medicationId);
            const overdue = isOverdue(intake.plannedTime);

            return (
              <Card
                key={intake.id}
                padding="large"
                className={overdue ? 'border-4 border-red-500' : ''}
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {medication?.color && (
                        <div
                          className="w-12 h-12 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: medication.color }}
                        />
                      )}
                      <div>
                        <h3 className="text-senior-xl font-bold">
                          {medication?.name}
                        </h3>
                        <p className="text-senior-lg text-gray-700">
                          {medication?.dosage}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-senior-xl font-bold ${overdue ? 'text-red-600' : 'text-blue-600'}`}>
                        {formatTime(intake.plannedTime)}
                      </p>
                      {overdue && (
                        <p className="text-senior-base text-red-600 font-semibold">
                          Überfällig!
                        </p>
                      )}
                      {intake.status === 'snoozed' && intake.snoozedUntil && (
                        <p className="text-senior-base text-orange-600">
                          Verschoben bis {formatTime(intake.snoozedUntil)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button
                      variant="success"
                      size="large"
                      icon="✓"
                      onClick={() => handleComplete(intake)}
                      fullWidth
                    >
                      Eingenommen
                    </Button>

                    <div className="grid grid-cols-3 gap-2">
                      {SNOOZE_DURATIONS.map(duration => (
                        <Button
                          key={duration.value}
                          variant="warning"
                          size="small"
                          onClick={() => handleSnooze(intake.id, duration.value)}
                        >
                          +{duration.value}m
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Completed Intakes */}
      {completedIntakes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-senior-xl font-bold text-green-700">
            Erledigt ({completedIntakes.length})
          </h2>
          {completedIntakes.map(intake => {
            const medication = medications.find(m => m.id === intake.medicationId);

            return (
              <Card key={intake.id} padding="normal" className="opacity-75">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">✓</span>
                    <div>
                      <p className="text-senior-lg font-semibold">
                        {medication?.name}
                      </p>
                      <p className="text-senior-base text-gray-600">
                        {formatTime(intake.plannedTime)}
                      </p>
                    </div>
                  </div>
                  {intake.actualTime && (
                    <p className="text-senior-base text-green-700">
                      {formatTime(intake.actualTime)}
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* No intakes today */}
      {todaysIntakes.length === 0 && (
        <Card padding="large">
          <p className="text-senior-lg text-center text-gray-500">
            Heute keine Medikamente geplant
          </p>
        </Card>
      )}
    </div>
  );
};
