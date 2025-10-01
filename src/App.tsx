/**
 * Main App Component
 * Root component with navigation and theme management
 */

import { useState, useEffect } from 'react';
import { TodayView } from './features/schedule/TodayView';
import { MedicationList } from './features/medications/MedicationList';
import { MedicationDetail } from './features/medications/MedicationDetail';
import { Button } from './components/Button';
import { initializeSettings } from './services/storage/database';
import { notificationService } from './services/notifications/notificationService';
import { intakeScheduler } from './services/scheduler/intakeScheduler';
import { notificationScheduler } from './services/scheduler/notificationScheduler';

type View = 'today' | 'medications' | 'medication-detail';

function App() {
  const [currentView, setCurrentView] = useState<View>('today');
  const [selectedMedicationId, setSelectedMedicationId] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    // Initialize database
    initializeSettings();

    // Check notification permission
    setNotificationsEnabled(notificationService.isSupported());

    // Start automatic schedulers
    intakeScheduler.startAutoScheduling();
    notificationScheduler.startAutoScheduling();
  }, []);

  const handleRequestNotifications = async () => {
    const permission = await notificationService.requestPermission();
    setNotificationsEnabled(permission === 'granted');
  };

  const handleSelectMedication = (id: string) => {
    setSelectedMedicationId(id);
    setCurrentView('medication-detail');
  };

  const handleBackToMedications = () => {
    setSelectedMedicationId(null);
    setCurrentView('medications');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Permission Banner */}
      {!notificationsEnabled && (
        <div className="bg-blue-600 text-white px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-senior-lg mb-3">
              🔔 Aktivieren Sie Benachrichtigungen, um an Ihre Medikamente erinnert zu werden.
            </p>
            <Button
              variant="secondary"
              size="medium"
              onClick={handleRequestNotifications}
            >
              Benachrichtigungen aktivieren
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {currentView === 'today' && <TodayView />}
        {currentView === 'medications' && (
          <MedicationList onSelectMedication={handleSelectMedication} />
        )}
        {currentView === 'medication-detail' && selectedMedicationId && (
          <MedicationDetail
            medicationId={selectedMedicationId}
            onBack={handleBackToMedications}
          />
        )}
      </div>

      {/* Bottom Navigation - iPhone Safe-Area optimiert */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-gray-200 shadow-lg" style={{ paddingBottom: 'var(--safe-area-bottom)' }}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={currentView === 'today' ? 'primary' : 'secondary'}
              size="large"
              onClick={() => setCurrentView('today')}
              icon="📅"
              fullWidth
            >
              Heute
            </Button>
            <Button
              variant={currentView === 'medications' ? 'primary' : 'secondary'}
              size="large"
              onClick={() => setCurrentView('medications')}
              icon="💊"
              fullWidth
            >
              Medikamente
            </Button>
          </div>
        </div>
      </nav>

      {/* Bottom spacer for fixed navigation + iPhone Home Indicator */}
      <div className="h-32" style={{ paddingBottom: 'var(--safe-area-bottom)' }} />
    </div>
  );
}

export default App;
