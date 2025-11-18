
import React, { useState, useEffect } from 'react';

const FeatureStatus: React.FC = () => {
  const [status, setStatus] = useState('Detecting features...');

  useEffect(() => {
    const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    const supportsWebAuthn = !!(window.PublicKeyCredential);
    setStatus(`getUserMedia: ${hasGetUserMedia ? '✅' : '❌'} — WebAuthn: ${supportsWebAuthn ? '✅' : '❌'}`);
  }, []);

  return (
    <div className="text-sm font-mono bg-black/20 px-3 py-1.5 rounded-md border border-white/10">
      {status}
    </div>
  );
};


export const Header: React.FC = () => {
  return (
    <header className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-cyan-300 to-indigo-400">
          Sensor Demo Hub
        </h1>
        <p className="mt-1 text-base text-gray-400 max-w-3xl">
          Camera, Torch, Mic demos — plus an experimental heart-rate prototype & breathing visualizer.
        </p>
      </div>
      <div className="flex-shrink-0 text-right">
        <FeatureStatus />
      </div>
    </header>
  );
};
