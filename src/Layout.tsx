import React, { useEffect, useRef, useState } from 'react';
import PrizeWheelSilver, { PrizeWheelRef1 } from './PrizeWheelSilver';
import QRScanner from './QRScanner';
import './App.css'; // We'll create this CSS file next
import PrizeWheelGold, { PrizeWheelRef2 } from './PrizeWheelGold';

const Layout: React.FC = () => {
  const wheel1Ref = useRef<PrizeWheelRef1>(null);
  const wheel2Ref = useRef<PrizeWheelRef2>(null);
  const [isWheelSpinning, setIsWheelSpinning] = useState<boolean>(false);

  useEffect(() => {
    const checkSpinningState = () => {
      const isAnyWheelSpinning = 
        (wheel1Ref.current?.isSpinning || false) ||
        (wheel2Ref.current?.isSpinning || false);
      setIsWheelSpinning(isAnyWheelSpinning);
    };

    // Check initially and set up an interval to check regularly
    checkSpinningState();
    const intervalId = setInterval(checkSpinningState, 100); // Check every 100ms

    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div className="layout" style={{backgroundImage: "url(/bg.png)"}}>
      <div className="left-section">
      </div>
      <div className="right-section">
        <div className="wheels-container">
          <div className="large-wheel">
            <PrizeWheelSilver ref={wheel1Ref}/>
          </div>
          <div className="large-wheel">
            <PrizeWheelGold ref={wheel2Ref} setIsWheelSpinning={setIsWheelSpinning} />
          </div>
        </div>
      </div>
      <div className="camera-container">
          <QRScanner onScan={(code) => {
                      if (code === 'T1') wheel1Ref.current?.spin();
                      if (code === 'T2') wheel2Ref.current?.spin();
                      if(code === 'RESET') 
                      {
                        wheel1Ref.current?.reset();
                        wheel2Ref.current?.reset();
                      }
                  } } isWheelSpinning={isWheelSpinning} />
        </div>
    </div>
  );
};

export default Layout;
