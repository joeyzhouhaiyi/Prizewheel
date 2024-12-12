import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

interface QRScannerProps {
  onScan: (code: string) => void;
  isWheelSpinning: boolean;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, isWheelSpinning }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    readerRef.current = new BrowserMultiFormatReader();

    const scan = async () => {
      if (isWheelSpinning || !isScanning) return;

      try {
        const videoElement = videoRef.current;
        if (videoElement && readerRef.current) {
          await readerRef.current.decodeFromConstraints(
            { video: { facingMode: 'environment' } },
            videoElement,
            (result, error) => {
              if (result) {
                const scannedCode = result.getText();
                console.log("code:" + scannedCode);
                onScan(scannedCode);
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

    if (!isWheelSpinning) {
      setIsScanning(true);
      scan(); // Start scanning immediately
    } else {
      setIsScanning(false);
      if (readerRef.current) {
        readerRef.current.reset();
      }
    }

    return () => {
      if (readerRef.current) {
        readerRef.current.reset();
      }
    };
  }, [onScan, isWheelSpinning, isScanning]);

  return (
    <div>

      <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );
};

export default QRScanner;

/**
 *       {isWheelSpinning ? (
        <p>Wheel is spinning. QR scanning paused.</p>
      ) : null}
 */