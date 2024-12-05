import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Winwheel } from '@evshiron/winwheel.js';

interface WheelProps {
  segments: Array<{ fillStyle: string; text: string }>;
}

export interface PrizeWheelRef {
  spin: () => void;
}

const PrizeWheel = forwardRef<PrizeWheelRef, WheelProps>(({ segments }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wheelRef = useRef<Winwheel | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      wheelRef.current = new Winwheel({
        canvasId: canvasRef.current.id,
        numSegments: segments.length,
        segments: segments,
        animation: {
          type: 'spinToStop',
          duration: 5,
          spins: 8,
        },
      });
    }
  }, [segments]);

  const handleSpin = () => {
    if (wheelRef.current) {
      wheelRef.current.startAnimation();
    }
  };

  useImperativeHandle(ref, () => ({
    spin: handleSpin
  }));

  return (
    <div>
      <canvas id="canvas" ref={canvasRef} width={500} height={500} />
      <button onClick={handleSpin}>Spin</button>
    </div>
  );
});

export default PrizeWheel;
