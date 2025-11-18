
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card } from './Card';
import { HeartIcon, StopCircleIcon } from './icons/SensorIcons';

interface PpgMonitorProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  stream: MediaStream | null;
  onRequireCamera: () => void;
}

export const PpgMonitor: React.FC<PpgMonitorProps> = ({ videoRef, stream, onRequireCamera }) => {
  const [ppgRunning, setPpgRunning] = useState(false);
  const [bpm, setBpm] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const dataRef = useRef<{ red: number[], time: number[] }>({ red: [], time: [] });

  const drawPpg = useCallback((arr: number[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (arr.length < 2) return;

    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const range = max - min || 1;

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffd166';
    ctx.beginPath();

    arr.forEach((value, i) => {
      const x = (i / (arr.length - 1)) * rect.width;
      const y = rect.height - ((value - min) / range * (rect.height - 10) + 5);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }, []);

  const stopPpg = useCallback(() => {
    setPpgRunning(false);
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    setBpm(null);
    dataRef.current = { red: [], time: [] };
    drawPpg([]);
  }, [drawPpg]);
  
  const ppgLoop = useCallback(() => {
    if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) {
      stopPpg();
      return;
    }
    
    const sample = sampleRedFromVideo(videoRef.current);
    if (sample !== null) {
      const { red, time } = dataRef.current;
      red.push(sample);
      time.push(performance.now());
      
      const maxSamples = 8 * 30; // ~8 seconds at 30fps
      if (red.length > maxSamples) {
        red.shift();
        time.shift();
      }

      drawPpg(red);

      if (time.length > 60 && time.length % 10 === 0) {
        const estimatedBpm = estimateBpmFromBuffer(red, time);
        setBpm(estimatedBpm);
      }
    }

    animationFrameId.current = requestAnimationFrame(ppgLoop);
  }, [videoRef, drawPpg, stopPpg]);
  
  const startPpg = async () => {
    if (!stream) {
        onRequireCamera();
        return;
    }
    setPpgRunning(true);
    setBpm(null);
    dataRef.current = { red: [], time: [] };
    animationFrameId.current = requestAnimationFrame(ppgLoop);
  };
  
  useEffect(() => {
      if(!stream && ppgRunning) {
          stopPpg();
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream, ppgRunning]);


  return (
    <Card title="Experimental Heart Rate (PPG)">
      <canvas ref={canvasRef} className="w-full h-32 bg-gradient-to-b from-[#071422] to-[#021018] rounded-lg"></canvas>
      <div className="mt-4 flex flex-wrap gap-2 items-center">
        <button onClick={startPpg} disabled={ppgRunning || !stream} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 disabled:bg-gray-500 transition-colors font-semibold">
          <HeartIcon /> Start PPG
        </button>
        <button onClick={stopPpg} disabled={!ppgRunning} className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 disabled:opacity-50 transition-colors">
          <StopCircleIcon /> Stop
        </button>
        <div className="flex-1 text-right">
          <span className="text-sm text-gray-400">Estimated BPM: </span>
          <span className="text-2xl font-bold text-white w-20 inline-block text-center">{bpm ?? '—'}</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-3">
        Gently place your fingertip over the rear camera until the waveform stabilizes. Results vary by device, lighting, and pressure.
      </p>
    </Card>
  );
};

function sampleRedFromVideo(video: HTMLVideoElement): number | null {
    const w = 160;
    const h = 120;
    if (!video.videoWidth || !video.videoHeight) return null;

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;

    try {
        ctx.drawImage(video, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h).data;
        let sum = 0;
        for (let i = 0; i < data.length; i += 4) {
            sum += data[i]; // Red channel
        }
        return sum / (data.length / 4);
    } catch (e) {
        console.error("Error sampling video frame for PPG:", e);
        return null;
    }
}

function estimateBpmFromBuffer(redArray: number[], timeArray: number[]): number | null {
  if (redArray.length < 30) return null;
  // Simple detrending by subtracting a moving average
  const windowSize = Math.floor(redArray.length / 8);
  const detrended = redArray.map((val, i, arr) => {
    const start = Math.max(0, i - windowSize);
    const end = Math.min(arr.length - 1, i + windowSize);
    let sum = 0;
    for (let j = start; j <= end; j++) sum += arr[j];
    return val - sum / (end - start + 1);
  });
  
  // Find peaks
  const peaks: number[] = [];
  for (let i = 1; i < detrended.length - 1; i++) {
    if (detrended[i] > detrended[i - 1] && detrended[i] > detrended[i + 1] && detrended[i] > 0) {
      peaks.push(i);
    }
  }

  if (peaks.length < 2) return null;

  // Calculate average interval between peaks
  const intervals = [];
  for (let i = 1; i < peaks.length; i++) {
    const t1 = timeArray[peaks[i - 1]];
    const t2 = timeArray[peaks[i]];
    intervals.push(t2 - t1);
  }
  
  const avgIntervalMs = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  if (avgIntervalMs === 0) return null;
  
  const bpm = 60000 / avgIntervalMs;
  return (bpm >= 40 && bpm <= 200) ? Math.round(bpm) : null;
}
