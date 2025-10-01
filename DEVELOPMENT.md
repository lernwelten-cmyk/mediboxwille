# Entwicklungsrichtlinien

> **Wichtig für AI-Assistenten (Claude Code):** Diese Datei enthält verbindliche Architektur- und Entwicklungsrichtlinien für dieses Projekt. Bitte lies und befolge diese Regeln bei jeder Code-Änderung.

---

## 🏗️ Architektur-Prinzipien

### Modularer "Lego-Baustein" Ansatz
- **Jede Komponente ist ein eigenständiger, isolierter Baustein**
- Komponenten haben klar definierte Schnittstellen
- Keine versteckten Abhängigkeiten zwischen Modulen
- Wiederverwendbarkeit durch klare Abstraktion

### Single Responsibility Principle
- Jede Datei/Komponente hat **genau eine Aufgabe**
- Große Komponenten werden in kleinere aufgeteilt
- Business-Logic getrennt von UI-Komponenten
- Maximale Dateigröße: **200-250 Zeilen**

### Komponenten-Isolation
```
✅ Gut: Komponenten kommunizieren über Props/Events
❌ Schlecht: Direkte Imports zwischen Business-Komponenten
```

---

## 📁 Projekt-Struktur

```
src/
├── components/          # Wiederverwendbare UI-Komponenten
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.types.ts
│   │   ├── Button.test.ts
│   │   └── index.ts
│   └── ...
│
├── features/           # Feature-spezifische Module
│   ├── auth/
│   │   ├── components/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── types/
│   └── dashboard/
│       └── ...
│
├── services/          # Business Logic & API-Calls
│   ├── api/
│   ├── storage/
│   └── ...
│
├── hooks/            # Shared Custom Hooks
├── utils/            # Hilfsfunktionen (pure functions)
├── types/            # Globale TypeScript Types
└── constants/        # Konstanten & Konfiguration
```

### Ordner-Konventionen
- **components/**: Nur UI-Komponenten, keine Business-Logic
- **features/**: In sich geschlossene Features mit eigenen Komponenten
- **services/**: API-Calls, externe Integrationen
- **hooks/**: Wiederverwendbare React Hooks
- **utils/**: Pure Functions ohne Side-Effects

---

## 🔧 Code-Änderungs-Regeln

### ⚠️ KRITISCH: Scope-Limitation

**Bei jeder Code-Änderung:**

1. **Ändere NUR die explizit angefragten Dateien**
2. **Keine "Optimierungen" an anderen Stellen** ohne Rückfrage
3. **Frage nach, wenn andere Dateien betroffen sind**
4. **Keine automatischen Refactorings** außerhalb des Scope

**Beispiel:**
```
Aufgabe: "Füge Loading-State zum Button hinzu"

✅ Ändern:
   - src/components/Button/Button.tsx
   - src/components/Button/Button.types.ts

❌ NICHT ändern ohne zu fragen:
   - Andere Komponenten
   - Shared Services
   - Global Types
```

### Neue Features
```
Neue Features = Neue Dateien/Komponenten

❌ Bestehende Dateien erweitern (außer minimal)
✅ Neue isolierte Module erstellen
```

---

## 🔗 Komponenten-Kommunikation

### Erlaubte Kommunikationswege

**1. Props (Parent → Child)**
```typescript
// ✅ Gut
<Button label="Submit" onClick={handleSubmit} />
```

**2. Events (Child → Parent)**
```typescript
// ✅ Gut
const handleChange = (value: string) => {
  onValueChange(value);
};
```

**3. Context API (Global State)**
```typescript
// ✅ Gut - für echten globalen State
const { user } = useAuth();
```

**4. Custom Hooks (Shared Logic)**
```typescript
// ✅ Gut - für wiederverwendbare Logik
const { data, loading } = useFetch('/api/users');
```

### Verbotene Patterns

```typescript
// ❌ Direkte Importe zwischen Features
import { validateUser } from '../../features/admin/utils';

// ❌ Globale Variablen
window.userData = currentUser;

// ❌ Tight Coupling
import AdminDashboard from '../admin/Dashboard';
```

---

## 📝 Code-Style & Best Practices

### TypeScript
- **Strikte Types** - kein `any` ohne guten Grund
- **Interfaces für Props** - klar definierte Schnittstellen
- **Type Exports** - Types in separaten `.types.ts` Dateien

```typescript
// ✅ Gut
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ ... }) => { ... };
```

### Naming Conventions
- **Komponenten**: PascalCase (`UserProfile.tsx`)
- **Funktionen/Hooks**: camelCase (`useAuth`, `formatDate`)
- **Konstanten**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Types/Interfaces**: PascalCase (`UserData`, `ApiResponse`)

### Datei-Struktur
```typescript
// 1. Imports (gruppiert)
import React from 'react';
import { useAuth } from '@/hooks';
import { Button } from '@/components';
import type { UserProps } from './User.types';

// 2. Types (wenn klein, sonst eigene Datei)
// 3. Component/Function
// 4. Exports
```

---

## 🧪 Testing-Richtlinien

### Test-Struktur
```
Component.tsx
Component.types.ts
Component.test.ts      # Unit Tests
Component.stories.ts   # Storybook (optional)
```

### Was wird getestet?
- ✅ Komponenten-Rendering
- ✅ User-Interaktionen
- ✅ Edge Cases
- ✅ Business Logic in Services
- ❌ Implementation Details

---

## 🚫 Anti-Patterns

### Zu vermeiden:

**1. God Components**
```typescript
// ❌ 500 Zeilen Komponente mit allem
const Dashboard = () => {
  // API Calls, State, Business Logic, UI...
};

// ✅ Aufgeteilt in kleinere Bausteine
const Dashboard = () => {
  return (
    <>
      <DashboardHeader />
      <DashboardStats />
      <DashboardChart />
    </>
  );
};
```

**2. Prop Drilling**
```typescript
// ❌ Props durch 5 Ebenen durchreichen
<A user={user}>
  <B user={user}>
    <C user={user}>
      <D user={user} />

// ✅ Context oder State Management nutzen
const { user } = useAuth();
```

**3. Mixed Concerns**
```typescript
// ❌ UI und Business Logic gemischt
const UserList = () => {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(u => u.active);
        const sorted = filtered.sort(...);
        setUsers(sorted);
      });
  }, []);
  
  return <div>...</div>;
};

// ✅ Getrennte Verantwortlichkeiten
const UserList = () => {
  const { users } = useUsers(); // Hook für Logic
  return <UserListUI users={users} />; // UI Komponente
};
```

---

## 🤖 Anweisungen für AI-Assistenten

### Workflow bei Anfragen

**1. Scope klären**
- Welche Dateien sind betroffen?
- Gibt es Abhängigkeiten?
- Ist die Änderung isoliert möglich?

**2. Vor der Änderung fragen**
```
"Diese Änderung betrifft auch Datei X. 
Soll ich diese auch anpassen oder nur [Ursprungsdatei]?"
```

**3. Nach Modularer Struktur arbeiten**
- Neue Features → Neue Dateien/Ordner
- Bestehende Features → Minimale, fokussierte Änderungen
- Immer Isolation im Kopf behalten

**4. Dokumentation**
- Neue Komponenten brauchen JSDoc-Kommentare
- Komplexe Logik wird erklärt
- Types sind selbsterklärend benannt

### Fragen, die du stellen solltest

- "Soll ich eine neue Komponente erstellen oder die bestehende erweitern?"
- "Diese Änderung betrifft auch [Datei X]. Wie möchtest du vorgehen?"
- "Ich sehe, dass [Pattern Y] verwendet wird. Soll ich das beibehalten?"

---

## 📚 Zusätzliche Ressourcen

- Siehe `README.md` für Setup-Anleitung
- Siehe `ARCHITECTURE.md` für detaillierte System-Architektur (falls vorhanden)
- Code-Style: [Projekt-spezifische Linter-Config]

---

## ✅ Checkliste für jeden Commit

- [ ] Nur angeforderte Dateien geändert
- [ ] Keine ungewollten Refactorings
- [ ] Types sind korrekt definiert
- [ ] Tests laufen durch
- [ ] Code folgt Naming-Conventions
- [ ] Komponente ist isoliert/wiederverwendbar
- [ ] Keine direkten Feature-zu-Feature Abhängigkeiten

---

**Version:** 1.0  
**Letzte Aktualisierung:** 2025-09-30