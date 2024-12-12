import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { Winwheel } from '@evshiron/winwheel.js';

interface WheelProps {
  setIsWheelSpinning: (spin: boolean) => void;
}

export interface PrizeWheelRef2 {
  spin: () => void;
  isSpinning: boolean;
  reset: () => void;
}

const PrizeWheelGold = forwardRef<PrizeWheelRef2, WheelProps>(({}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wheelRef = useRef<Winwheel | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  
  useEffect(() => {
    if (canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        // Initialize the Winwheel
        wheelRef.current = new Winwheel({
          canvasId: 'canvas-gold',
          drawMode: 'image',
          numSegments: 6,
          wheelImage: img,
          segments:            // Pass in segment parameters (text is optional, not displayed).
          [
              {'text' : '1', 'size' : 72},
              {'text' : '2', 'size' : 18},    // 30 degrees size.
              {'text' : '3', 'size' : 90},
              {'text' : '4', 'size' : 36},    // 15 degrees.
              {'text' : '5', 'size' : 54},
              {'text' : '6', 'size' : 90}
          ],
          animation: {
            type: 'spinToStop',
            duration: 10,
            spins: 16,
            callbackFinished: onSpinComplete, // Directly pass the function reference
            //callbackAfter: drawTriangle, // Directly pass the function reference
          }
        });
        wheelRef.current.draw();
      };
      img.src = '/wheel-gold.png'; // Ensure this path is correct
    }
  }, []);
  const onReset = () => {
    if(wheelRef.current){
      (wheelRef.current as any).rotationAngle = 0;
  
      // Redraw the wheel to reflect the reset state
      wheelRef.current.draw();
    }
  }
 
  const handleSpin = () => {
    if (wheelRef.current) {
      setIsSpinning(true);
      // Reset the rotation angle to 0
      (wheelRef.current as any).rotationAngle = 0;
  
      // Redraw the wheel to reflect the reset state
      wheelRef.current.draw();
  
      // Start the spin animation
      wheelRef.current.startAnimation();
    }
  };
  const onSpinComplete = () => {
    setIsSpinning(false);
  };

  useImperativeHandle(ref, () => ({
    spin: handleSpin,
    isSpinning: isSpinning,
    reset: onReset
  }));

  return (
    <div style={{ position: 'relative', width: 512, height: 512 }}>
      {/* Canvas for the wheel */}
      <canvas id="canvas-gold" ref={canvasRef} width={512} height={512} />

      {/* Pointer Image */}
      <img
        src="pointer.png" // Replace with your image path
        alt="Pointer"
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 60, // Adjust size as needed
          height: 60,
        }}
      />

      {/* Spin Button */}
      <button onClick={handleSpin} style={{ marginTop: 20, display:'none' }}>
        Spin
      </button>
    </div>
  );
});

export default PrizeWheelGold;
