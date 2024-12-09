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
      const img = new Image();
      img.onload = () => {
        // Initialize the Winwheel
        wheelRef.current = new Winwheel({
          canvasId: 'canvas',
          drawMode: 'image',
          wheelImage: img,
          animation: {
            type: 'spinToStop',
            duration: 5,
            spins: 8,
            callbackFinished: alertPrize, // Directly pass the function reference
            callbackAfter: drawTriangle, // Directly pass the function reference
          },
          segments: segments.map((segment) => ({
            fillStyle: segment.fillStyle,
            text: segment.text,
          })),
        });
        wheelRef.current.draw();
      };
      img.src = '/completewheel.png'; // Ensure this path is correct
    }
  }, [segments]);

  const handleSpin = () => {
    if (wheelRef.current) {
      // Reset the rotation angle to 0
      (wheelRef.current as any).rotationAngle = 0;
  
      // Redraw the wheel to reflect the reset state
      wheelRef.current.draw();
  
      // Start the spin animation
      wheelRef.current.startAnimation();
    }
  };
  

  useImperativeHandle(ref, () => ({
    spin: handleSpin,
  }));

  // Function to alert the prize after the spin is finished
  const alertPrize = () => {
    if (wheelRef.current) {
      // Get the current rotation angle.
      
      let rotationAngle = (wheelRef.current as any).rotationAngle % 360; // Normalize to 0-360
      if (rotationAngle < 0) rotationAngle += 360; // Handle negative angles

  
      console.log('Rotation Angle:', rotationAngle);
  
      // Calculate the winning segment
      const totalSegments = segments.length;
      const segmentSize = 360 / totalSegments; // Each segment's angular size
  
      // Determine the index of the winning segment
      const winningIndex = Math.floor((360 - rotationAngle) / segmentSize) % totalSegments;
  
      console.log('Winning Index:', winningIndex);
  
      // Get the corresponding segment
      const winningSegment = segments[winningIndex];
  
      alert(`You have won: ${winningSegment.text}!`);
    }
  };
  

  // Function to draw the pointer
  const drawTriangle = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = 'navy';
        ctx.fillStyle = 'aqua';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(250, 5);
        ctx.lineTo(270, 5);
        ctx.lineTo(260, 40);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
      }
    }
  };

  return (
    <div style={{ position: 'relative', width: 512, height: 512 }}>
      {/* Canvas for the wheel */}
      <canvas id="canvas" ref={canvasRef} width={512} height={512} />

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
      <button onClick={handleSpin} style={{ marginTop: 20 }}>
        Spin
      </button>
    </div>
  );
});

export default PrizeWheel;
