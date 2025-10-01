/**
 * Modal Component Types
 */

import { ReactNode } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  showCloseButton?: boolean;
  size?: 'small' | 'medium' | 'large' | 'full';
}
