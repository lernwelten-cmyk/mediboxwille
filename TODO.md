# 📋 MediBox - TODO & Roadmap

> **Stand:** 2025-10-01
> **Version:** 1.0.0 (MVP Funktional)

---

## ✅ **MVP Abgeschlossen!**

Die kritischen Features für eine funktionale App sind implementiert. Die App kann jetzt:
- ✅ Medikamente verwalten
- ✅ Einnahme-Zeiten planen
- ✅ Nüchtern-Einnahme konfigurieren
- ✅ Automatische Benachrichtigungen senden
- ✅ Einnahmen tracken

---

## 🎉 **Kürzlich implementiert** (Commit: 28c180d)

### ✅ 1. Schedule-Management UI
**Status:** ✅ Implementiert
**Priorität:** 🔴 CRITICAL

**Implementierte Komponenten:**
- ✅ [TimePicker](src/components/TimePicker/TimePicker.tsx) - Zeitauswahl mit großen Touch-Bereichen
- ✅ [WeekdaySelector](src/components/WeekdaySelector/WeekdaySelector.tsx) - Wochentags-Auswahl (Mo-So)
- ✅ [ScheduleForm](src/features/schedule/ScheduleForm.tsx) - Formular mit Nüchtern-Zeitfenstern
- ✅ [ScheduleManager](src/features/schedule/ScheduleManager.tsx) - Schedule-Verwaltung pro Medikament
- ✅ [MedicationDetail](src/features/medications/MedicationDetail.tsx) - Detail-Seite mit Schedule-Übersicht

**Features:**
- ✅ Hinzufügen/Bearbeiten/Löschen von Einnahme-Zeiten
- ✅ Wochentags-spezifische Planung
- ✅ Aktiv/Inaktiv Toggle
- ✅ Nüchtern-Zeitfenster konfigurierbar (vor/nach Einnahme)

---

### ✅ 2. Automatischer Intake-Scheduler
**Status:** ✅ Implementiert
**Priorität:** 🔴 CRITICAL

**Implementierung:**
- ✅ [intakeScheduler.ts](src/services/scheduler/intakeScheduler.ts)

**Features:**
- ✅ Generiert täglich Intake-Einträge basierend auf aktiven Schedules
- ✅ Prüft Wochentags-Bedingungen
- ✅ Läuft automatisch beim App-Start
- ✅ Erneute Generierung um Mitternacht (00:01 Uhr)
- ✅ Erstellt nur Intakes für noch nicht existierende Zeiten

**Integration:**
```typescript
// In App.tsx
useEffect(() => {
  intakeScheduler.startAutoScheduling(); // Startet automatisch
}, []);
```

---

### ✅ 3. Nüchtern-Zeitfenster UI
**Status:** ✅ Implementiert
**Priorität:** 🟠 HIGH

**Implementierung:**
In [ScheduleForm.tsx](src/features/schedule/ScheduleForm.tsx):

**Features:**
- ✅ Dropdown "Nüchtern vor Einnahme" (0/15/30/60/120 Min)
- ✅ Dropdown "Nüchtern nach Einnahme" (0/30/60/120 Min)
- ✅ Visuelle Hinweise: "Sie erhalten X Min vorher eine Erinnerung"
- ✅ Gelbe Info-Box in ScheduleManager zeigt Nüchtern-Zeitfenster an

---

### ✅ 4. Notification-Scheduler für Nüchtern-Phasen
**Status:** ✅ Implementiert
**Priorität:** 🟠 HIGH

**Implementierung:**
- ✅ [notificationScheduler.ts](src/services/scheduler/notificationScheduler.ts)

**Features:**
- ✅ Berechnet Nüchtern-Start-Zeit (X Min vor Einnahme)
- ✅ Sendet "⚠️ Ab jetzt nichts mehr essen!" Benachrichtigung
- ✅ Sendet "⏰ Bald Medikament einnehmen" (15 Min vorher)
- ✅ Sendet "💊 Medikament einnehmen" zur Einnahmezeit
- ✅ Sendet "✅ Sie können wieder essen!" nach Nüchtern-Phase
- ✅ Automatische Bestandsverwaltung bei Einnahme
- ✅ Low-Stock Warnungen (wenn unter Schwellwert)

**Integration:**
```typescript
// In TodayView.tsx
await notificationScheduler.markIntakeCompletedWithNotification(intake.id);
// Markiert als erledigt + plant Fasting-End Notification
```

---

### ✅ 5. Navigation & App-Integration
**Status:** ✅ Implementiert

**Änderungen:**
- ✅ [App.tsx](src/App.tsx) - Navigation zu Medikament-Details
- ✅ [MedicationList.tsx](src/features/medications/MedicationList.tsx) - "⚙️"-Button für Einstellungen
- ✅ Zurück-Navigation implementiert

**User-Flow:**
```
Medikamente Tab → ⚙️ klicken → MedicationDetail
→ ScheduleManager → Neue Einnahme-Zeit → ScheduleForm
```

---

## 🟡 **Wichtige Features (für vollständigen MVP)**

### ⚠️ 5. Einnahme-Historie mit Kalender
**Status:** Nicht implementiert
**Priorität:** 🟡 MEDIUM

**Was fehlt:**
- [ ] Kalender-Komponente (Monatsansicht)
- [ ] Farbcodierung: Grün = vollständig, Gelb = teilweise, Rot = verpasst
- [ ] Detail-Ansicht pro Tag (welche Medikamente)
- [ ] Navigation zwischen Monaten
- [ ] Integration als 3. Tab in App.tsx

**Dateien zu erstellen:**
```
src/features/history/
├── HistoryView.tsx              # Haupt-Komponente
├── Calendar.tsx                 # Kalender-Komponente
└── DayDetail.tsx                # Tages-Detail-Ansicht
```

**Verwendung:**
```tsx
// In App.tsx
{currentView === 'history' && <HistoryView />}
```

**Daten nutzen:**
```typescript
// Bereits vorhanden in useIntakes.ts
const stats = getIntakeStats(startDate, endDate);
// { total, completed, missed, completionRate }
```

---

### ⚠️ 6. Statistik-Dashboard
**Status:** Nicht implementiert
**Priorität:** 🟡 MEDIUM

**Was fehlt:**
- [ ] Einnahme-Quote (%) Woche/Monat
- [ ] Anzahl versäumter Einnahmen
- [ ] Beste/schlechteste Wochentage
- [ ] Streak-Anzeige ("5 Tage in Folge vollständig")
- [ ] Visuelle Diagramme (optional)

**Datei zu erstellen:**
```
src/features/history/
└── StatisticsView.tsx
```

**Kann in HistoryView integriert werden oder als separater Tab.**

---

## 🟢 **Nice-to-Have Features (Post-MVP)**

### 📸 7. Foto-Upload für Medikamente
**Status:** Nicht implementiert
**Priorität:** 🟢 LOW

**Was fehlt:**
- [ ] Bild-Upload in MedicationForm
- [ ] Kamera-Zugriff (mobil)
- [ ] Bild-Speicherung in IndexedDB (Blob)
- [ ] Thumbnail-Anzeige in Medikamentenliste
- [ ] Bild-Anzeige in MedicationDetail

**Technische Hinweise:**
```typescript
// In Medication Type erweitern:
interface Medication {
  imageUrl?: string;  // Base64 Data-URL
  imageBlob?: Blob;   // Original-Bild für IndexedDB
}

// Upload-Logik:
<input
  type="file"
  accept="image/*"
  capture="environment" // Mobile Kamera
  onChange={handleImageUpload}
/>
```

**IndexedDB Speicherung:**
```typescript
// Blobs können direkt in Dexie gespeichert werden
await db.medications.add({
  ...medication,
  imageBlob: imageFile // File/Blob Objekt
});
```

---

### 🌙 8. Nacht-Modus
**Status:** Nicht implementiert
**Priorität:** 🟢 LOW

**Was fehlt:**
- [ ] Toggle-Button in Settings-View (noch zu erstellen)
- [ ] Dark-Theme CSS-Variablen
- [ ] Automatische Erkennung (System-Preference)
- [ ] Speicherung in AppSettings

**Implementation:**
```typescript
// In AppSettings Type erweitern (bereits vorhanden):
interface AppSettings {
  nightMode: boolean; // ✅ Bereits definiert
}

// CSS:
.night-mode {
  background-color: #1a1a1a;
  color: #ffffff;
}

.night-mode .card {
  background-color: #2a2a2a;
  border-color: #444;
}

// Auto-Detection:
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
```

---

### 🔊 9. Sprachausgabe
**Status:** Nicht implementiert
**Priorität:** 🟢 LOW

**Was fehlt:**
- [ ] Text-to-Speech API Integration
- [ ] Vorlesen von Medikamentennamen
- [ ] Vorlesen von Einnahme-Zeiten in TodayView
- [ ] Toggle in Settings

**API:**
```typescript
function speak(text: string) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'de-DE';
  utterance.rate = 0.9; // Langsamer für Senioren
  window.speechSynthesis.speak(utterance);
}

// Verwendung:
<Button onClick={() => speak(medication.name)}>
  🔊 Vorlesen
</Button>
```

---

### 📦 10. Erweiterte Bestandsverwaltung
**Status:** Teilweise implementiert
**Priorität:** 🟢 LOW

**Was bereits funktioniert:**
- ✅ Stock-Feld in Medication
- ✅ lowStockThreshold definierbar
- ✅ Automatisches Decrement bei Einnahme (in notificationScheduler)
- ✅ Low-Stock Warnung bei Unterschreitung

**Was noch fehlt:**
- [ ] Manuelle Bestandskorrektur in MedicationForm
- [ ] Visueller Indikator in MedicationList (z.B. roter Punkt)
- [ ] "Nachbestellen"-Reminder (z.B. 3 Tage vorher)
- [ ] Historie: Wann wurde nachgefüllt?

**Erweiterung:**
```typescript
// In MedicationForm.tsx erweitert:
<div>
  <label>Aktueller Bestand</label>
  <input
    type="number"
    value={formData.stock}
    onChange={(e) => handleStockChange(e.target.value)}
  />
  <Button onClick={handleRefill}>
    📦 Nachgefüllt (+{refillAmount})
  </Button>
</div>
```

---

### 👥 11. Mehrere Benutzer-Profile
**Status:** Nicht implementiert
**Priorität:** 🟢 LOW

**Use Case:**
Mutter und Vater haben jeweils eigene Medikamente und Einnahme-Zeiten.

**Was fehlt:**
- [ ] User-Model in Database
- [ ] User-Auswahl beim App-Start
- [ ] Filterung aller Daten nach User-ID
- [ ] Profil-Verwaltung (Hinzufügen/Löschen)

**Datenmodell:**
```typescript
interface User {
  id: string;
  name: string;
  avatar?: string;
  createdAt: Date;
}

// Alle anderen Modelle erweitern:
interface Medication {
  userId: string; // Referenz
  // ... rest
}
```

**UI:**
```
App-Start → User-Auswahl →
[Mutter] [Vater] [+ Neu]
```

---

### 📤 12. Export-Funktion
**Status:** Nicht implementiert
**Priorität:** 🟢 LOW

**Was fehlt:**
- [ ] Export als PDF (für Arztbesuch)
- [ ] Export als CSV (für Excel)
- [ ] Export-Dialog in Settings oder History
- [ ] Auswahl: Welche Daten exportieren?

**Optionen:**
```typescript
// PDF-Export (Browser Print API):
function exportAsPDF() {
  window.print(); // Nutzt CSS @media print
}

// CSV-Export:
function exportAsCSV() {
  const csv = intakes.map(i =>
    `${i.medicationName},${i.plannedTime},${i.status}`
  ).join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'medikamente.csv';
  a.click();
}
```

---

## 📂 Dateistruktur-Übersicht

### ✅ Bereits implementiert
```
src/
├── components/
│   ├── Button/              ✅
│   ├── Card/                ✅
│   ├── Modal/               ✅
│   ├── TimePicker/          ✅ (NEU)
│   └── WeekdaySelector/     ✅ (NEU)
├── features/
│   ├── medications/
│   │   ├── MedicationList.tsx      ✅
│   │   ├── MedicationForm.tsx      ✅
│   │   └── MedicationDetail.tsx    ✅ (NEU)
│   └── schedule/
│       ├── TodayView.tsx           ✅
│       ├── ScheduleForm.tsx        ✅ (NEU)
│       └── ScheduleManager.tsx     ✅ (NEU)
├── hooks/
│   ├── useMedications.ts           ✅
│   ├── useSchedule.ts              ✅
│   └── useIntakes.ts               ✅
├── services/
│   ├── storage/
│   │   └── database.ts             ✅
│   ├── notifications/
│   │   └── notificationService.ts  ✅
│   └── scheduler/
│       ├── intakeScheduler.ts      ✅ (NEU)
│       └── notificationScheduler.ts ✅ (NEU)
├── types/index.ts                  ✅
└── constants/index.ts              ✅
```

### ❌ Noch zu erstellen
```
src/
├── components/
│   └── Calendar/            ❌ (für Historie)
├── features/
│   ├── history/
│   │   ├── HistoryView.tsx      ❌
│   │   ├── Calendar.tsx         ❌
│   │   ├── DayDetail.tsx        ❌
│   │   └── StatisticsView.tsx   ❌
│   └── settings/
│       └── SettingsView.tsx     ❌ (für Nacht-Modus, Schriftgröße etc.)
```

---

## 🚀 Empfohlene Implementierungs-Reihenfolge

**Phase 1: MVP Abgeschlossen** ✅
1. ✅ Schedule-Management UI
2. ✅ Intake-Scheduler Service
3. ✅ Nüchtern-Zeitfenster UI
4. ✅ Notification-Scheduler

**Phase 2: User-Experience verbessern** (Optional)
5. 🟡 Einnahme-Historie mit Kalender
6. 🟡 Statistik-Dashboard
7. 🟢 Nacht-Modus
8. 🟢 Sprachausgabe

**Phase 3: Erweiterte Features** (Nice-to-Have)
9. 🟢 Foto-Upload
10. 🟢 Erweiterte Bestandsverwaltung
11. 🟢 Mehrere Benutzer-Profile
12. 🟢 Export-Funktion

---

## 🛠️ Setup-Anleitung für Entwickler

### Neue Komponente hinzufügen

Befolge die **Architektur-Richtlinien** in [DEVELOPMENT.md](./DEVELOPMENT.md):

1. **Erstelle Ordner-Struktur:**
   ```bash
   mkdir -p src/components/ComponentName
   ```

2. **Erstelle Dateien:**
   ```
   src/components/ComponentName/
   ├── ComponentName.tsx         # Haupt-Komponente
   ├── ComponentName.types.ts    # TypeScript Types
   └── index.ts                  # Export
   ```

3. **Definiere Props-Interface:**
   ```typescript
   // ComponentName.types.ts
   export interface ComponentNameProps {
     prop1: string;
     prop2?: boolean;
   }
   ```

4. **Implementiere Komponente:**
   ```typescript
   // ComponentName.tsx
   import React from 'react';
   import type { ComponentNameProps } from './ComponentName.types';

   export const ComponentName: React.FC<ComponentNameProps> = ({ prop1, prop2 }) => {
     return <div>{prop1}</div>;
   };
   ```

5. **Exportiere:**
   ```typescript
   // index.ts
   export { ComponentName } from './ComponentName';
   export type { ComponentNameProps } from './ComponentName.types';
   ```

### Testen
```bash
npm run dev        # Development Server
npm run build      # Production Build
npm run preview    # Preview Build
```

---

## 📝 API-Referenz

### Hooks

**useMedications()**
```typescript
const {
  medications,           // Medication[]
  addMedication,        // (data) => Promise<string>
  updateMedication,     // (id, updates) => Promise<void>
  deleteMedication,     // (id) => Promise<void>
  getMedicationById     // (id) => Promise<Medication | undefined>
} = useMedications();
```

**useSchedule()**
```typescript
const {
  schedules,                  // Schedule[]
  addSchedule,               // (data) => Promise<string>
  updateSchedule,            // (id, updates) => Promise<void>
  deleteSchedule,            // (id) => Promise<void>
  getSchedulesForMedication, // (medId) => Promise<Schedule[]>
  toggleScheduleActive       // (id) => Promise<void>
} = useSchedule();
```

**useIntakes()**
```typescript
const {
  intakes,               // Intake[]
  addIntake,            // (data) => Promise<string>
  markIntakeCompleted,  // (id) => Promise<void>
  markIntakeMissed,     // (id) => Promise<void>
  snoozeIntake,         // (id, minutes) => Promise<void>
  getTodaysIntakes,     // () => Intake[]
  getUpcomingIntakes,   // () => Intake[]
  getIntakeStats        // (start, end) => { total, completed, missed, completionRate }
} = useIntakes();
```

### Services

**notificationService**
```typescript
notificationService.requestPermission();                        // Promise<NotificationPermission>
notificationService.sendMedicationReminder(name, time);         // void
notificationService.sendFastingStartNotification(name, mins);   // void
notificationService.sendFastingEndNotification(name);           // void
notificationService.sendUpcomingReminder(name, mins);           // void
notificationService.sendLowStockWarning(name, stock);           // void
```

**intakeScheduler** ✅ NEU
```typescript
intakeScheduler.startAutoScheduling();     // Startet automatische tägliche Generierung
intakeScheduler.generateTodaysIntakes();   // Manuell Intakes für heute erstellen
intakeScheduler.manualGenerate();          // Alias für Testing
```

**notificationScheduler** ✅ NEU
```typescript
notificationScheduler.startAutoScheduling();                    // Startet automatische Benachrichtigungen
notificationScheduler.scheduleUpcomingNotifications();          // Plant alle anstehenden Notifications
notificationScheduler.markIntakeCompletedWithNotification(id);  // Markiert Intake + plant Fasting-End
notificationScheduler.manualRefresh();                          // Neu-Planung aller Notifications
```

---

## 🤝 Contribution Guidelines

1. **Lies [DEVELOPMENT.md](./DEVELOPMENT.md)** - Architektur-Richtlinien
2. **Erstelle Feature-Branch:** `git checkout -b feature/history-view`
3. **Befolge Naming-Conventions:** PascalCase für Komponenten, camelCase für Funktionen
4. **Komponenten-Isolation:** Keine direkten Imports zwischen Features
5. **TypeScript:** Strikte Types, kein `any`
6. **Commit-Messages:** Aussagekräftig, auf Deutsch
7. **Teste lokal:** `npm run build` muss erfolgreich sein

---

## 📞 Kontakt & Support

- **Repository:** [github.com/lernwelten-cmyk/mediboxwille](https://github.com/lernwelten-cmyk/mediboxwille)
- **Issues:** GitHub Issues nutzen
- **Deployment:** Netlify (Auto-Deploy bei Push auf `master`)
- **Live-URL:** https://mediboxwille.netlify.app (nach Deploy)

---

## 🎉 Changelog

### Version 1.0.0 - 2025-10-01
**MVP Release - App ist funktional nutzbar!**

**Neue Features:**
- ✅ Schedule-Management UI (TimePicker, WeekdaySelector, ScheduleForm, ScheduleManager)
- ✅ MedicationDetail-Seite mit Navigation
- ✅ Automatischer Intake-Scheduler (täglich um Mitternacht)
- ✅ Notification-Scheduler für Nüchtern-Phasen
- ✅ Bestandsverwaltung mit Auto-Decrement
- ✅ Low-Stock Warnungen
- ✅ App-Navigation erweitert

**Bugfixes:**
- TypeScript-Fehler behoben
- Build erfolgreich

**Dateien hinzugefügt:**
- `src/components/TimePicker/`
- `src/components/WeekdaySelector/`
- `src/features/medications/MedicationDetail.tsx`
- `src/features/schedule/ScheduleForm.tsx`
- `src/features/schedule/ScheduleManager.tsx`
- `src/services/scheduler/intakeScheduler.ts`
- `src/services/scheduler/notificationScheduler.ts`

**Commit:** `28c180d`

### Version 0.1.0 - 2025-10-01
**Initial Release - Basis-Features**

- ✅ Medikamentenverwaltung (CRUD)
- ✅ Basis-Komponenten (Button, Card, Modal)
- ✅ Database Setup (IndexedDB mit Dexie)
- ✅ Notification Service
- ✅ PWA-Konfiguration
- ✅ Senioren-freundliches UI-Design

**Commit:** `040f8ca`

---

**Version:** 1.0.0
**Letzte Aktualisierung:** 2025-10-01
**Status:** ✅ MVP Abgeschlossen - App ist produktionsbereit!
