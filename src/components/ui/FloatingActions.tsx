import React from 'react';
import { WhatsAppWidget } from '../WhatsAppWidget';
import { TaxAssistantWidget } from '../TaxAssistantWidget';

export interface FloatingActionsProps {
  onOpenBooking: () => void;
  onOpenVault: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  onOpenBooking,
  onOpenVault
}) => {
  return (
    <>
      {/* Floating Assistant IA Widget (Bottom-Left) */}
      <TaxAssistantWidget />

      {/* Floating WhatsApp Widget (Bottom-Right) */}
      <WhatsAppWidget
        onOpenBooking={onOpenBooking}
        onOpenVault={onOpenVault}
      />
    </>
  );
};
