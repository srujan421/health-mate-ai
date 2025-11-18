
import React, { useState, useEffect, useRef } from 'react';
import { CameraControl } from './components/CameraControl';
import { PpgMonitor } from './components/PpgMonitor';
import { MicVisualizer } from './components/MicVisualizer';
import { InfoPanel } from './components/InfoPanel';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOpening, setIsCameraOpening] = useState(false);

  // Effect to handle cleanup of the stream when the component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071021] to-[#04101a] text-[#e6eef8] font-sans antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-2xl bg-gradient-to-b from-white/5 to-transparent shadow-2xl shadow-black/40 p-5 md:p-7">
          <Header />
          <main className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 flex flex-col gap-6">
              <CameraControl
                videoRef={videoRef}
                onStreamChange={setStream}
                isPpgRunning={false} // This can be expanded to link states if needed
                isCameraOpening={isCameraOpening}
                setIsCameraOpening={setIsCameraOpening}
              />
              <PpgMonitor
                videoRef={videoRef}
                stream={stream}
                onRequireCamera={async () => {
                  if (!stream && videoRef.current && !isCameraOpening) {
                     // This simulates a click or triggers the open camera function
                     const openButton = document.getElementById('open-camera-btn');
                     openButton?.click();
                  }
                }}
              />
              <MicVisualizer />
            </div>
            <div className="lg:col-span-2 flex flex-col gap-6">
              <InfoPanel />
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default App;
