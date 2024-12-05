import React from 'react';
import QRScanner from './QRScanner';
import PrizeWheel from './PrizeWheel';

const App: React.FC = () => {
  const segments = [
    { fillStyle: '#eae56f', text: 'Prize One' },
    { fillStyle: '#89f26e', text: 'Prize Two' },
    { fillStyle: '#7de6ef', text: 'Prize Three' },
    { fillStyle: '#e7706f', text: 'Prize Four' },
  ];

  return (
    <div className="App">
      <h1>QR Code Scanner App</h1>
      <QRScanner />
    </div>
  );
};

export default App;
