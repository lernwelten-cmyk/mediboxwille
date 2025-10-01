/**
 * Global constants and configuration
 */

export const APP_NAME = 'MediBox';
export const APP_VERSION = '1.0.0';

export const DAYS_OF_WEEK = [
  'Sonntag',
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag'
] as const;

export const DAYS_OF_WEEK_SHORT = [
  'So',
  'Mo',
  'Di',
  'Mi',
  'Do',
  'Fr',
  'Sa'
] as const;

export const FASTING_DURATIONS = [
  { value: 15, label: '15 Minuten' },
  { value: 30, label: '30 Minuten' },
  { value: 60, label: '1 Stunde' },
  { value: 120, label: '2 Stunden' },
  { value: 180, label: '3 Stunden' }
] as const;

export const SNOOZE_DURATIONS = [
  { value: 5, label: '5 Minuten' },
  { value: 15, label: '15 Minuten' },
  { value: 30, label: '30 Minuten' }
] as const;

export const FONT_SIZES = {
  normal: 'text-base',
  large: 'text-senior-lg',
  'extra-large': 'text-senior-2xl'
} as const;

export const MEDICATION_COLORS = [
  { value: 'white', label: 'Weiß', hex: '#FFFFFF' },
  { value: 'yellow', label: 'Gelb', hex: '#FEF08A' },
  { value: 'orange', label: 'Orange', hex: '#FED7AA' },
  { value: 'red', label: 'Rot', hex: '#FECACA' },
  { value: 'pink', label: 'Pink', hex: '#FBCFE8' },
  { value: 'blue', label: 'Blau', hex: '#BFDBFE' },
  { value: 'green', label: 'Grün', hex: '#BBF7D0' }
] as const;

export const MEDICATION_SHAPES = [
  { value: 'round', label: 'Rund', icon: '●' },
  { value: 'oval', label: 'Oval', icon: '◯' },
  { value: 'capsule', label: 'Kapsel', icon: '⬭' },
  { value: 'square', label: 'Eckig', icon: '■' }
] as const;
