/**
 * Main App Component
 * Root component with navigation and theme management
 */

import { useState, useEffect } from 'react';
import { TodayView } from './features/schedule/TodayView';
import { MedicationList } from './features/medications/MedicationList';
import { Button } from './components/Button';
import { initializeSettings } from './services/storage/database';
import { notificationService } from './services/notifications/notificationService';

type View = 'today' | 'medications' | 'settings';

function App() {
  const [currentView, setCurrentView] = useState<View>('today');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    // Initialize database
    initializeSettings();

    // Check notification permission
    setNotificationsEnabled(notificationService.isSupported());
  }, []);

  const handleRequestNotifications = async () => {
    const permission = await notificationService.requestPermission();
    setNotificationsEnabled(permission === 'granted');
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
        {currentView === 'medications' && <MedicationList />}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3">
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

      {/* Bottom spacer for fixed navigation */}
      <div className="h-32" />
    </div>
  );
}

export default App;
