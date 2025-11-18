
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-8 pt-6 border-t border-white/10 text-xs text-gray-500">
      <div className="p-3 mb-4 rounded-lg bg-yellow-900/30 border border-yellow-400/30 text-yellow-300">
        <span className="font-bold">⚠️ Disclaimer:</span> This demo is experimental and for educational purposes only — not for diagnosis. Please follow privacy rules and obtain user permission before accessing sensors.
      </div>
      <p>
        Created for prototyping. This UI can be integrated with a backend, secure data storage, or a professional SDK (for better SpO₂ / BP estimation).
      </p>
    </footer>
  );
};
