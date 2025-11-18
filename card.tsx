
import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  ariaLive?: 'polite' | 'assertive' | 'off';
}

export const Card: React.FC<CardProps> = ({ title, children, ariaLive = 'polite' }) => {
  return (
    <div
      className="bg-[#0f1724] p-4 rounded-xl shadow-lg shadow-black/30 border border-white/10"
      aria-live={ariaLive}
    >
      <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
      {children}
    </div>
  );
};
