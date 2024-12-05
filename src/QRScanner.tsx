import React, { useState, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import PrizeWheel, { PrizeWheelRef } from './PrizeWheel';

const QRScanner: React.FC = () => {
  const [qrCode, setQrCode] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const wheelRef = useRef<PrizeWheelRef>(null);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();

    const scan = async () => {
      try {
        const videoElement = videoRef.current;
        if (videoElement) {
          await reader.decodeFromConstraints(
            { video: { facingMode: 'environment' } },
            videoElement,
            (result, error) => {
              if (result) {
                const scannedCode = result.getText();
                setQrCode(scannedCode);
                if (scannedCode === 'T1') {
                  wheelRef.current?.spin();
                }
              }
              if (error) {
                console.error("Scanning error:", error);
              }
            }
          );
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    scan();

    return () => {
      reader.reset();
    };
  }, []);

  const segments = [
    { fillStyle: '#eae56f', text: 'Prize One' },
    { fillStyle: '#89f26e', text: 'Prize Two' },
    { fillStyle: '#7de6ef', text: 'Prize Three' },
    { fillStyle: '#e7706f', text: 'Prize Four' },
  ];

  return (
    <div>
      <h2>QR Code Scanner</h2>
      <video ref={videoRef} />
      <p>Scanned QR Code: {qrCode}</p>
      <PrizeWheel ref={wheelRef} segments={segments} />
    </div>
  );
};

export default QRScanner;
