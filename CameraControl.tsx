import React, { useState, useCallback } from 'react';
import { Card } from './Card';
import { CameraIcon, SwitchCameraIcon, BoltIcon, SnapshotIcon } from './icons/SensorIcons';

interface CameraControlProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  onStreamChange: (stream: MediaStream | null) => void;
  isPpgRunning: boolean;
  isCameraOpening: boolean;
  setIsCameraOpening: (isOpening: boolean) => void;
}

export const CameraControl: React.FC<CameraControlProps> = ({ videoRef, onStreamChange, isPpgRunning, isCameraOpening, setIsCameraOpening }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [status, setStatus] = useState('Camera: idle');

  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      onStreamChange(null);
      setStatus('Camera: stopped');
      setTorchSupported(false);
      setTorchOn(false);
    }
  }, [stream, onStreamChange]);

  const openCamera = useCallback(async (mode: string) => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('Camera: not supported');
      return;
    }
    stopStream();
    setIsCameraOpening(true);
    setStatus('Camera: opening...');
    try {
      const constraints: MediaStreamConstraints = {
        audio: false,
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        }
      };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      onStreamChange(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      const videoTrack = newStream.getVideoTracks()[0];
      const capabilities = videoTrack.getCapabilities ? videoTrack.getCapabilities() : {} as any;
      setTorchSupported(!!capabilities.torch);
      setStatus(`Camera: ${videoTrack.label || 'active'}`);
    } catch (err) {
      console.error('openCamera error', err);
      setStatus('Camera: permission denied or unavailable');
    } finally {
        setIsCameraOpening(false);
    }
  }, [stopStream, onStreamChange, videoRef, setIsCameraOpening]);

  const handleOpenCamera = () => openCamera(facingMode);

  const handleSwitchCamera = () => {
    const newMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newMode);
    openCamera(newMode);
  };

  const handleToggleTorch = async () => {
    if (!stream || !torchSupported) return;
    const videoTrack = stream.getVideoTracks()[0];
    try {
      const newTorchState = !torchOn;
      // FIX: Object literal may only specify known properties, and 'torch' does not exist in type 'MediaTrackConstraintSet'.
      await videoTrack.applyConstraints({ advanced: [{ torch: newTorchState }] } as any);
      setTorchOn(newTorchState);
    } catch (err) {
      console.error('toggleTorch error', err);
      setStatus('Torch: failed');
    }
  };

  const handleTakeSnapshot = () => {
    if (!videoRef.current || !stream) return;
    const video = videoRef.current;
    const { videoWidth: w, videoHeight: h } = video;
    if (!w || !h) {
      setStatus('Snapshot: video not ready');
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, w, h);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `snapshot-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  return (
    <Card title="Camera & Torch">
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto bg-black rounded-lg aspect-video" />
      <div className="mt-4 flex flex-wrap gap-2 items-center">
        <button id="open-camera-btn" onClick={handleOpenCamera} disabled={isCameraOpening || isPpgRunning} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:bg-gray-500 transition-colors font-semibold">
          <CameraIcon /> {stream ? 'Restart' : 'Open'} Camera
        </button>
        <button onClick={handleSwitchCamera} disabled={!stream || isCameraOpening} className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 disabled:opacity-50 transition-colors">
          <SwitchCameraIcon /> Switch
        </button>
        <button onClick={handleToggleTorch} disabled={!torchSupported || isCameraOpening} className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors disabled:opacity-50 ${torchOn ? 'bg-yellow-400 text-black' : 'bg-white/10 hover:bg-white/20'}`}>
          <BoltIcon /> Torch
        </button>
        <button onClick={handleTakeSnapshot} disabled={!stream || isCameraOpening} className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 disabled:opacity-50 transition-colors">
          <SnapshotIcon /> Snapshot
        </button>
        <div className="flex-1 text-right text-sm text-gray-400 font-mono truncate">{status}</div>
      </div>
      <p className="text-xs text-gray-500 mt-3">
        Note: Torch control is most reliable on Chrome for Android.
      </p>
    </Card>
  );
};
