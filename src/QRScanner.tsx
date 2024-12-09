import React, { useState, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import PrizeWheel, { PrizeWheelRef } from './PrizeWheel';

const QRScanner: React.FC = () => {
  const [qrCode, setQrCode] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const wheelRef = useRef<PrizeWheelRef>(null);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    let scanning = true;

    const scan = async () => {
      try {
        const videoElement = videoRef.current;
        if (videoElement) {
          await reader.decodeFromConstraints(
            { video: { facingMode: 'environment' } },
            videoElement,
            (result, error) => {
              if (result && scanning) {
                const scannedCode = result.getText();
                setQrCode(scannedCode);

                if (scannedCode === 'T1') {
                  scanning = false; // Prevent multiple spins for the same QR code.
                  wheelRef.current?.spin();
                  setTimeout(() => {
                    scanning = true; // Re-enable scanning after the spin.
                  }, 5000); // Adjust timing based on spin duration.
                }
              }
              if (error && !(error instanceof Error)) {
                // Handle scanning issues without flooding the console.
                console.debug("Scanning in progress...");
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
    { fillStyle: '#eae56f', text: 'Prize 1' },
    { fillStyle: '#89f26e', text: 'Prize 2' },
    { fillStyle: '#7de6ef', text: 'Prize 3' },
    { fillStyle: '#e7706f', text: 'Prize 4' },

  ];
  
  const spinWheel = () => {
    if (wheelRef.current) {
      wheelRef.current.spin();
    }
  };

  return (
    <div>
      <h2>QR Code Scanner</h2>
      <video
        ref={videoRef}
        style={{
          width: '100%',
          maxWidth: '480px',
          border: '1px solid #ccc',
          borderRadius: '8px',
        }}
        autoPlay
        playsInline
      />
      <p>Scanned QR Code: {qrCode || 'None'}</p>
      <PrizeWheel ref={wheelRef} segments={segments} />
    </div>
  );
};

export default QRScanner;
