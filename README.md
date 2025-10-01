# 💊 MediBox - Medikamenten Erinnerungs-App

Eine benutzerfreundliche Progressive Web App (PWA) für Senioren zur Verwaltung und Erinnerung an Medikamenteneinnahmen.

## 🌟 Features

- **📋 Medikamentenverwaltung**: Einfaches Hinzufügen, Bearbeiten und Löschen von Medikamenten
- **⏰ Einnahme-Zeiten**: Flexible Zeitplanung mit Wochentags-Optionen
- **🍽️ Nüchtern-Einnahme**: Automatische Erinnerungen für Ess-Zeitfenster vor/nach der Einnahme
- **🔔 Push-Benachrichtigungen**: Rechtzeitige Erinnerungen für Medikamente und Essens-Pausen
- **📊 Einnahme-Historie**: Übersicht über erledigte und versäumte Einnahmen
- **♿ Senioren-freundlich**: Große Schrift, hoher Kontrast, große Touch-Bereiche
- **📱 PWA**: Installierbar, funktioniert offline

## 🚀 Installation

### Voraussetzungen

- Node.js 18+
- npm oder yarn

### Setup

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Production Build
npm run build

# Preview Production Build
npm run preview
```

## 🏗️ Architektur

Das Projekt folgt einer strikten modularen Architektur. Siehe [DEVELOPMENT.md](DEVELOPMENT.md) für Details.

```
src/
├── components/          # Wiederverwendbare UI-Komponenten
├── features/           # Feature-spezifische Module
│   ├── medications/    # Medikamentenverwaltung
│   ├── schedule/       # Zeitplanung
│   └── fasting/        # Nüchtern-Einnahme
├── services/          # Business Logic & API
│   ├── storage/       # IndexedDB
│   └── notifications/ # Push-Benachrichtigungen
├── hooks/            # Custom React Hooks
└── types/            # TypeScript Definitionen
```

## 📦 Tech Stack

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Dexie.js** - IndexedDB Wrapper
- **Vite PWA Plugin** - Progressive Web App

## 🌐 Deployment (Netlify)

1. Projekt auf GitHub pushen
2. Netlify mit Repository verbinden
3. Build Command: `npm run build`
4. Publish Directory: `dist`

## 📝 Nutzung

### Medikament hinzufügen

1. Navigiere zu "Medikamente"
2. Klicke "Neues Medikament"
3. Fülle Name, Dosierung und optionale Details aus
4. Speichern

### Einnahme-Zeit einrichten

1. Wähle ein Medikament
2. Füge Einnahme-Zeiten hinzu
3. Optional: Nüchtern-Zeitfenster einstellen
4. Aktiviere Benachrichtigungen

### Nüchtern-Einnahme

Wenn ein Medikament nüchtern eingenommen werden muss:

1. Stelle "Vor Einnahme nüchtern" ein (z.B. 30 Min)
2. Stelle "Nach Einnahme nüchtern" ein (z.B. 60 Min)
3. Du erhältst automatisch 3 Benachrichtigungen:
   - ⚠️ "Ab jetzt nichts mehr essen!" (30 Min vorher)
   - 💊 "Jetzt Medikament einnehmen" (zur Einnahmezeit)
   - ✅ "Du kannst wieder essen!" (60 Min danach)

## 🎨 Senioren-Freundliche Features

- **Große Schrift**: Min. 20px, einstellbar bis 40px
- **Hoher Kontrast**: Dunkler Text auf hellem Grund
- **Touch-Bereiche**: Min. 48x48px Buttons
- **Einfache Navigation**: Max. 2 Hauptscreens
- **Klare Icons**: Große, eindeutige Symbole
- **Sprachausgabe**: Optional aktivierbar

## 🔐 Datenschutz

- Alle Daten werden lokal im Browser gespeichert (IndexedDB)
- Keine Server-Kommunikation
- Keine Datensammlung oder Tracking

## 🤝 Beitragen

Pull Requests sind willkommen! Bitte lies [DEVELOPMENT.md](DEVELOPMENT.md) für Entwicklungsrichtlinien.

## 📄 Lizenz

MIT

## 👨‍💻 Entwickelt mit

- Claude Code (AI-Assistent)
- ❤️ für Senioren
