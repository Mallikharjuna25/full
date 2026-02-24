import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const QRDisplay = ({ value }) => {
  return (
    <div style={{ textAlign: 'center', margin: '2rem' }}>
      <QRCodeSVG value={value} size={256} />
    </div>
  );
};

export default QRDisplay;
