# 📋 MediBox - TODO & Roadmap

> **Stand:** 2025-10-01
> **Version:** 0.1.0 (MVP in Entwicklung)

---

## 🚨 **Kritische Features (Blocker für MVP)**

Diese Features sind **zwingend erforderlich**, damit die App funktional nutzbar ist:

### ❌ 1. Schedule-Management UI
**Status:** Nicht implementiert
**Priorität:** 🔴 CRITICAL

**Problem:**
Aktuell gibt es keine Möglichkeit, Einnahme-Zeiten für Medikamente zu konfigurieren. Die App kann zwar Medikamente speichern, aber niemand kann festlegen, *wann* sie eingenommen werden sollen.

**Was fehlt:**
- [ ] UI zum Hinzufügen von Einnahme-Zeiten pro Medikament
- [ ] Zeit-Picker Komponente (HH:mm Format)
- [ ] Wochentags-Auswahl (Mo-So, einzeln oder mehrfach)
- [ ] Schedule-Liste in Medikamentendetails
- [ ] Bearbeiten/Löschen von Schedules

**Dateien zu erstellen:**
```
src/features/schedule/
├── ScheduleManager.tsx          # Haupt-UI für Schedule-Verwaltung
├── ScheduleForm.tsx              # Formular zum Hinzufügen/Bearbeiten
├── WeekdaySelector.tsx           # Wochentags-Auswahl Komponente
└── TimePicker.tsx                # Zeit-Auswahl Komponente
```

**Verwendung:**
```tsx
// In MedicationList.tsx oder neue Detail-Seite
<ScheduleManager medicationId={selectedMedicationId} />
```

---

### ❌ 2. Automatischer Intake-Scheduler
**Status:** Nicht implementiert
**Priorität:** 🔴 CRITICAL

**Problem:**
Auch wenn Schedules angelegt werden, erstellt nichts automatisch die täglichen `Intake`-Einträge, die in der Today-View angezeigt werden sollen.

**Was fehlt:**
- [ ] Service, der täglich um Mitternacht läuft
- [ ] Erstellt Intakes basierend auf aktiven Schedules
- [ ] Prüft Wochentags-Bedingungen
- [ ] Berücksichtigt Nüchtern-Zeitfenster

**Datei zu erstellen:**
```
src/services/scheduler/
└── intakeScheduler.ts
```

**Logik:**
```typescript
// Beispiel-Logik
function generateDailyIntakes() {
  const today = new Date();
  const dayOfWeek = today.getDay();

  // Hole alle aktiven Schedules für diesen Wochentag
  const activeSchedules = schedules.filter(s =>
    s.isActive && s.daysOfWeek.includes(dayOfWeek)
  );

  // Erstelle Intake-Einträge für jedes Schedule
  for (const schedule of activeSchedules) {
    const plannedTime = new Date();
    plannedTime.setHours(schedule.time.split(':')[0]);
    plannedTime.setMinutes(schedule.time.split(':')[1]);

    await addIntake({
      medicationId: schedule.medicationId,
      scheduleId: schedule.id,
      plannedTime: plannedTime,
      status: 'pending'
    });
  }
}
```

**Integration:**
- Wird beim App-Start aufgerufen
- Läuft über `setInterval()` oder Service Worker
- Optional: Web Workers für Background-Ausführung

---

### ❌ 3. Nüchtern-Zeitfenster UI
**Status:** Datenmodell vorhanden, UI fehlt
**Priorität:** 🟠 HIGH

**Problem:**
Die Nüchtern-Einnahme ist ein Kern-Feature (Feature #8), aber es gibt keine UI zum Konfigurieren.

**Was fehlt:**
- [ ] UI-Felder in ScheduleForm für `fastingBefore` / `fastingAfter`
- [ ] Dropdown mit vordefinierten Zeiten (15/30/60/120 Min)
- [ ] Visueller Indikator in Today-View für aktive Nüchtern-Phase
- [ ] Timer-Anzeige: "Noch X Min bis zur Einnahme"

**Änderungen:**
```typescript
// In ScheduleForm.tsx hinzufügen:
<select name="fastingBefore">
  <option value="0">Keine Einschränkung</option>
  <option value="15">15 Minuten vorher nüchtern</option>
  <option value="30">30 Minuten vorher nüchtern</option>
  <option value="60">1 Stunde vorher nüchtern</option>
  <option value="120">2 Stunden vorher nüchtern</option>
</select>

<select name="fastingAfter">
  <option value="0">Keine Einschränkung</option>
  <option value="30">30 Minuten danach nüchtern</option>
  <option value="60">1 Stunde danach nüchtern</option>
  <option value="120">2 Stunden danach nüchtern</option>
</select>
```

---

### ❌ 4. Notification-Scheduler für Nüchtern-Phasen
**Status:** Service bereit, Scheduler fehlt
**Priorität:** 🟠 HIGH

**Problem:**
Der `notificationService` kann Benachrichtigungen senden, aber niemand ruft die Funktionen zur richtigen Zeit auf.

**Was fehlt:**
- [ ] Service, der `fastingBefore`-Zeit berechnet
- [ ] Sendet Benachrichtigung: "⚠️ Ab jetzt nichts mehr essen!"
- [ ] Sendet Benachrichtigung zur Einnahmezeit: "💊 Medikament einnehmen"
- [ ] Sendet Benachrichtigung nach `fastingAfter`: "✅ Du kannst wieder essen!"

**Datei zu erstellen:**
```
src/services/scheduler/
└── fastingScheduler.ts
```

**Logik:**
```typescript
function scheduleFastingNotifications(intake: Intake, schedule: Schedule) {
  const intakeTime = new Date(intake.plannedTime);

  // Benachrichtigung: Nüchtern-Phase beginnt
  if (schedule.fastingBefore) {
    const fastingStartTime = new Date(intakeTime.getTime() - schedule.fastingBefore * 60000);
    setTimeout(() => {
      notificationService.sendFastingStartNotification(
        medication.name,
        schedule.fastingBefore
      );
    }, fastingStartTime.getTime() - Date.now());
  }

  // Benachrichtigung: Einnahme-Zeit
  setTimeout(() => {
    notificationService.sendMedicationReminder(medication.name, time);
  }, intakeTime.getTime() - Date.now());

  // Benachrichtigung: Essen erlaubt
  if (schedule.fastingAfter) {
    const fastingEndTime = new Date(intakeTime.getTime() + schedule.fastingAfter * 60000);
    setTimeout(() => {
      notificationService.sendFastingEndNotification(medication.name);
    }, fastingEndTime.getTime() - Date.now());
  }
}
```

**Integration:**
- Wird beim Erstellen von Intakes aufgerufen
- Nutzt `setTimeout` oder Service Worker Notifications API

---

## 🟡 **Wichtige Features (für vollständigen MVP)**

### ⚠️ 5. Einnahme-Historie mit Kalender
**Status:** Tracking-Logik vorhanden, UI fehlt
**Priorität:** 🟡 MEDIUM

**Was fehlt:**
- [ ] Kalender-Komponente (Monatsansicht)
- [ ] Farbcodierung: Grün = vollständig, Gelb = teilweise, Rot = verpasst
- [ ] Detail-Ansicht pro Tag (welche Medikamente)
- [ ] Navigation zwischen Monaten

**Dateien zu erstellen:**
```
src/features/history/
├── HistoryView.tsx              # Haupt-Komponente
├── Calendar.tsx                 # Kalender-Komponente
└── DayDetail.tsx                # Tages-Detail-Ansicht
```

**Verwendung:**
```tsx
// In App.tsx als dritter Tab
<Button onClick={() => setView('history')}>
  📊 Historie
</Button>

{currentView === 'history' && <HistoryView />}
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

**Datei zu erstellen:**
```
src/features/history/
└── StatisticsView.tsx
```

**API nutzen:**
```typescript
// Bereits vorhanden in useIntakes.ts
const stats = getIntakeStats(startDate, endDate);
// { total, completed, missed, completionRate }
```

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

**Technische Hinweise:**
```typescript
// Speichern von Bildern in IndexedDB
interface Medication {
  imageUrl?: string;  // Base64 oder Blob-URL
  imageBlob?: Blob;   // Original-Bild
}
```

---

### 🌙 8. Nacht-Modus
**Status:** Nicht implementiert
**Priorität:** 🟢 LOW

**Was fehlt:**
- [ ] Toggle-Button in Settings
- [ ] Dark-Theme CSS-Variablen
- [ ] Automatische Erkennung (System-Preference)
- [ ] Speicherung in AppSettings

**Implementation:**
```typescript
// In AppSettings
nightMode: boolean;

// CSS
.night-mode {
  background-color: #1a1a1a;
  color: #ffffff;
}
```

---

### 🔊 9. Sprachausgabe
**Status:** Nicht implementiert
**Priorität:** 🟢 LOW

**Was fehlt:**
- [ ] Text-to-Speech API Integration
- [ ] Vorlesen von Medikamentennamen
- [ ] Vorlesen von Einnahme-Zeiten
- [ ] Toggle in Settings

**API:**
```typescript
function speak(text: string) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'de-DE';
  window.speechSynthesis.speak(utterance);
}
```

---

### 🔔 10. Bestandsverwaltung mit Warnungen
**Status:** Datenmodell vorhanden, Warnungen fehlen
**Priorität:** 🟢 LOW

**Was fehlt:**
- [ ] Automatische Warnung bei niedrigem Bestand
- [ ] Benachrichtigung: "⚠️ Medikament wird knapp"
- [ ] Countdown in Medikamentenliste
- [ ] Auto-Decrement bei Einnahme

**Integration:**
```typescript
// In markIntakeCompleted()
const medication = await getMedicationById(intake.medicationId);
if (medication.stock !== undefined) {
  await updateMedication(medication.id, {
    stock: medication.stock - 1
  });

  if (medication.stock - 1 <= medication.lowStockThreshold) {
    notificationService.sendLowStockWarning(medication.name, medication.stock - 1);
  }
}
```

---

## 📂 Dateistruktur-Übersicht

### Bereits vorhanden ✅
```
src/
├── components/
│   ├── Button/          ✅
│   ├── Card/            ✅
│   └── Modal/           ✅
├── features/
│   ├── medications/
│   │   ├── MedicationList.tsx    ✅
│   │   └── MedicationForm.tsx    ✅
│   └── schedule/
│       └── TodayView.tsx         ✅
├── hooks/
│   ├── useMedications.ts         ✅
│   ├── useSchedule.ts            ✅
│   └── useIntakes.ts             ✅
├── services/
│   ├── storage/
│   │   └── database.ts           ✅
│   └── notifications/
│       └── notificationService.ts ✅
├── types/index.ts                ✅
└── constants/index.ts            ✅
```

### Noch zu erstellen ❌
```
src/
├── components/
│   ├── TimePicker/      ❌ (CRITICAL)
│   ├── WeekdaySelector/ ❌ (CRITICAL)
│   └── Calendar/        ❌
├── features/
│   ├── schedule/
│   │   ├── ScheduleManager.tsx  ❌ (CRITICAL)
│   │   └── ScheduleForm.tsx     ❌ (CRITICAL)
│   └── history/
│       ├── HistoryView.tsx      ❌
│       ├── Calendar.tsx         ❌
│       └── StatisticsView.tsx   ❌
└── services/
    └── scheduler/
        ├── intakeScheduler.ts   ❌ (CRITICAL)
        └── fastingScheduler.ts  ❌ (HIGH)
```

---

## 🚀 Empfohlene Implementierungs-Reihenfolge

1. **🔴 CRITICAL**: Schedule-Management UI (Feature #1)
2. **🔴 CRITICAL**: Intake-Scheduler Service (Feature #2)
3. **🟠 HIGH**: Nüchtern-Zeitfenster UI (Feature #3)
4. **🟠 HIGH**: Notification-Scheduler (Feature #4)
5. **🟡 MEDIUM**: Einnahme-Historie (Feature #5)
6. **🟡 MEDIUM**: Statistik-Dashboard (Feature #6)
7. **🟢 LOW**: Post-MVP Features (#7-10)

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

---

## 🤝 Contribution Guidelines

1. **Lies [DEVELOPMENT.md](./DEVELOPMENT.md)** - Architektur-Richtlinien
2. **Erstelle Feature-Branch:** `git checkout -b feature/schedule-ui`
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

---

**Version:** 1.0
**Letzte Aktualisierung:** 2025-10-01
