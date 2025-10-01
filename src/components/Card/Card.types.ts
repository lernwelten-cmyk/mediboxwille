/**
 * Card Component Types
 */

import { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  padding?: 'none' | 'small' | 'normal' | 'large';
  elevated?: boolean;
}
