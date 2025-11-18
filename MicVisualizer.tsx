
import React, { useState, useRef, useCallback } from 'react';
import { Card } from './Card';
import { MicrophoneIcon, StopCircleIcon } from './icons/SensorIcons';

export const MicVisualizer: React.FC = () => {
  const [micActive, setMicActive] = useState(false);
  const [status, setStatus] = useState('Microphone: idle');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const draw = useCallback(() => {
    const analyser = analyserRef.current;
    const canvas = canvasRef.current;
    if (!analyser || !canvas) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#06d6a0';
    ctx.beginPath();
    
    const sliceWidth = rect.width * 1.0 / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = v * rect.height / 2;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }
    
    ctx.lineTo(rect.width, rect.height / 2);
    ctx.stroke();

    animationFrameId.current = requestAnimationFrame(draw);
  }, []);

  const openMic = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('Microphone: not supported');
      return;
    }
    try {
      setStatus('Microphone: opening...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;
      
      setMicActive(true);
      setStatus('Microphone: active');
      draw();
    } catch (err) {
      console.error('openMic error', err);
      setStatus('Microphone: permission denied');
    }
  };

  const closeMic = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    setMicActive(false);
    setStatus('Microphone: stopped');

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  return (
    <Card title="Microphone Amplitude Visualizer">
      <canvas ref={canvasRef} className="w-full h-28 bg-gradient-to-b from-[#071422] to-[#021018] rounded-lg"></canvas>
      <div className="mt-4 flex flex-wrap gap-2 items-center">
        <button onClick={openMic} disabled={micActive} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 disabled:bg-gray-500 transition-colors font-semibold">
          <MicrophoneIcon /> Open Mic
        </button>
        <button onClick={closeMic} disabled={!micActive} className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 disabled:opacity-50 transition-colors">
          <StopCircleIcon /> Stop
        </button>
        <div className="flex-1 text-right text-sm text-gray-400 font-mono">{status}</div>
      </div>
       <p className="text-xs text-gray-500 mt-3">
        Visualize your breath or ambient sound levels. This is for demonstration and is not a medical tool.
      </p>
    </Card>
  );
};
