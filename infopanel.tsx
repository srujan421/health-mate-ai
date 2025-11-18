
import React from 'react';
import { Card } from './Card';

const sensorData = [
  { type: 'Heart Rate / Pulse', sensors: 'Camera + Flash', use: 'Cardiogram, Binah.ai, Apple Health' },
  { type: 'Blood Pressure', sensors: 'Camera + Flash', use: 'Binah.ai, Shen AI, HemaApp' },
  { type: 'Blood Oxygen (SpO₂)', sensors: 'Camera + Flash', use: 'Pulse Oximeter Apps' },
  { type: 'Breathing Rate', sensors: 'Camera, Microphone', use: 'Binah.ai, wellness apps' },
  { type: 'Stress Level', sensors: 'Camera + Flash, Mic', use: 'Binah.ai, Bio-Scan' },
  { type: 'Skin Analysis', sensors: 'Camera', use: 'SkinVision, AI diagnostic apps' },
];

export const InfoPanel: React.FC = () => {
  return (
    <>
      <Card title="Potential Sensor Applications">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-white/5">
              <tr>
                <th scope="col" className="px-4 py-2">Scan Type</th>
                <th scope="col" className="px-4 py-2">Sensor(s)</th>
              </tr>
            </thead>
            <tbody>
              {sensorData.map((item, index) => (
                <tr key={index} className="border-b border-white/10">
                  <td className="px-4 py-3 font-medium text-white whitespace-nowrap">{item.type}</td>
                  <td className="px-4 py-3 text-gray-400">{item.sensors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
         <p className="text-xs text-gray-500 mt-3">
          <strong>Note:</strong> Advanced vital sign estimations require specialized, validated SDKs. This demo uses simplified algorithms for educational purposes.
        </p>
      </Card>
      <Card title="Quick Deploy">
        <ol className="text-sm text-gray-400 list-decimal list-inside space-y-1">
            <li>Create a new repository on GitHub.</li>
            <li>Push the project files to the repository.</li>
            <li>Enable GitHub Pages in repository settings.</li>
            <li>Access via the provided HTTPS URL.</li>
        </ol>
      </Card>
    </>
  );
};
