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
  const { snoozeIntake, uncompleteIntake } = useIntakes();

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

  // Group pending intakes by time
  const groupedPendingIntakes = pendingIntakes.reduce((groups, intake) => {
    const timeKey = formatTime(intake.plannedTime);
    if (!groups[timeKey]) {
      groups[timeKey] = [];
    }
    groups[timeKey].push(intake);
    return groups;
  }, {} as Record<string, Intake[]>);

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

      {/* Pending Intakes - Grouped by Time */}
      {pendingIntakes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-senior-xl font-bold">Anstehend</h2>
          {Object.entries(groupedPendingIntakes).map(([time, intakes]) => {
            const anyOverdue = intakes.some(i => isOverdue(i.plannedTime));

            return (
              <Card
                key={time}
                padding="large"
                className={anyOverdue ? 'border-4 border-red-500' : ''}
              >
                <div className="space-y-4">
                  {/* Time Header */}
                  <div className="flex items-center justify-between pb-3 border-b-2 border-gray-200">
                    <p className={`text-senior-2xl font-bold ${anyOverdue ? 'text-red-600' : 'text-blue-600'}`}>
                      {time}
                    </p>
                    {anyOverdue && (
                      <p className="text-senior-base text-red-600 font-semibold">
                        Überfällig!
                      </p>
                    )}
                  </div>

                  {/* Medications at this time */}
                  {intakes.map(intake => {
                    const medication = medications.find(m => m.id === intake.medicationId);

                    return (
                      <div key={intake.id} className="space-y-3">
                        {/* Medication Info with Toggle */}
                        <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3 flex-1">
                            <div>
                              <h3 className="text-senior-xl font-bold">
                                {medication?.name}
                              </h3>
                              <p className="text-senior-lg text-gray-700">
                                {medication?.dosage}
                              </p>
                              {intake.status === 'snoozed' && intake.snoozedUntil && (
                                <p className="text-senior-base text-orange-600 mt-1">
                                  Verschoben bis {formatTime(intake.snoozedUntil)}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Checkbox Toggle */}
                          <button
                            onClick={() => handleComplete(intake)}
                            className="w-16 h-16 rounded-lg border-4 border-gray-400 bg-white flex items-center justify-center hover:bg-green-50 hover:border-green-600 transition-all active:scale-95"
                            aria-label="Als eingenommen markieren"
                          >
                            <span className="text-4xl text-gray-400">☐</span>
                          </button>
                        </div>

                        {/* Snooze Buttons */}
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
                    );
                  })}
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
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div>
                      <p className="text-senior-lg font-semibold">
                        {medication?.name}
                      </p>
                      <p className="text-senior-base text-gray-600">
                        Geplant: {formatTime(intake.plannedTime)}
                        {intake.actualTime && ` • Eingenommen: ${formatTime(intake.actualTime)}`}
                      </p>
                    </div>
                  </div>

                  {/* Checkbox Toggle - Checked */}
                  <button
                    onClick={() => uncompleteIntake(intake.id)}
                    className="w-12 h-12 rounded-lg border-4 border-green-600 bg-green-50 flex items-center justify-center hover:bg-green-100 transition-all active:scale-95"
                    aria-label="Wieder aktivieren"
                  >
                    <span className="text-3xl text-green-600">☑</span>
                  </button>
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
