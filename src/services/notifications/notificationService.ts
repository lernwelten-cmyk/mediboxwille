/**
 * Web Notifications Service
 * Handles push notifications for medication reminders and fasting alerts
 */

export class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Request notification permission from user
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  }

  /**
   * Check if notifications are supported and permitted
   */
  isSupported(): boolean {
    return 'Notification' in window && Notification.permission === 'granted';
  }

  /**
   * Send a medication intake reminder
   */
  sendMedicationReminder(medicationName: string, time: string): void {
    if (!this.isSupported()) return;

    new Notification('💊 Medikament einnehmen', {
      body: `${medicationName} um ${time} Uhr`,
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      tag: `medication-${medicationName}-${time}`,
      requireInteraction: true
    });

    // Vibrate if supported
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  }

  /**
   * Send fasting start notification (stop eating)
   */
  sendFastingStartNotification(medicationName: string, minutesUntilIntake: number): void {
    if (!this.isSupported()) return;

    new Notification('⚠️ Nicht mehr essen!', {
      body: `Für ${medicationName} - Einnahme in ${minutesUntilIntake} Minuten`,
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      tag: `fasting-start-${medicationName}`,
      requireInteraction: true
    });

    // Vibrate if supported
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  }

  /**
   * Send fasting end notification (can eat again)
   */
  sendFastingEndNotification(medicationName: string): void {
    if (!this.isSupported()) return;

    new Notification('✅ Sie können wieder essen!', {
      body: `Nüchtern-Phase für ${medicationName} beendet`,
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      tag: `fasting-end-${medicationName}`
    });

    // Vibrate if supported
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  }

  /**
   * Send upcoming intake reminder (X minutes before)
   */
  sendUpcomingReminder(medicationName: string, minutesUntil: number): void {
    if (!this.isSupported()) return;

    new Notification('⏰ Bald Medikament einnehmen', {
      body: `${medicationName} in ${minutesUntil} Minuten`,
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      tag: `reminder-${medicationName}-${minutesUntil}`
    });

    // Vibrate if supported
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  }

  /**
   * Send low stock warning
   */
  sendLowStockWarning(medicationName: string, remainingStock: number): void {
    if (!this.isSupported()) return;

    new Notification('⚠️ Medikament wird knapp', {
      body: `${medicationName}: Nur noch ${remainingStock} Stück`,
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      tag: `low-stock-${medicationName}`
    });
  }
}

export const notificationService = NotificationService.getInstance();
