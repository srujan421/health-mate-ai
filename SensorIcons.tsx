
import React from 'react';

const Icon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const CameraIcon: React.FC = () => (
  <Icon>
    <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM4 14a1 1 0 001 1h10a1 1 0 001-1V8a1 1 0 00-1-1H5a1 1 0 00-1 1v6zM6 11a2 2 0 104 0 2 2 0 00-4 0z" />
  </Icon>
);

export const SwitchCameraIcon: React.FC = () => (
  <Icon>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1.707-12.707a1 1 0 00-1.414 0L9 6.586V5a1 1 0 00-2 0v4a1 1 0 001 1h4a1 1 0 000-2H9.414l1.293-1.293a1 1 0 000-1.414zM11 10a1 1 0 00-1-1H6a1 1 0 000 2h3.586l-1.293 1.293a1 1 0 101.414 1.414L11 11.414V13a1 1 0 102 0v-4a1 1 0 00-1-1z" clipRule="evenodd" />
  </Icon>
);

export const BoltIcon: React.FC = () => (
  <Icon>
    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
  </Icon>
);

export const SnapshotIcon: React.FC = () => (
  <Icon>
    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
  </Icon>
);

export const HeartIcon: React.FC = () => (
  <Icon>
    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
  </Icon>
);

export const StopCircleIcon: React.FC = () => (
  <Icon>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 000-2H9V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </Icon>
);

export const MicrophoneIcon: React.FC = () => (
  <Icon>
    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-1a6 6 0 11-12 0H3a7.001 7.001 0 006 6.93V17H7a1 1 0 100 2h6a1 1 0 100-2h-2v-2.07z" clipRule="evenodd" />
  </Icon>
);
