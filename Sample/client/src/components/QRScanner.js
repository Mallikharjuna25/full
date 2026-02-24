import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = ({ onScan }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: 250 });
    scanner.render((decodedText) => {
      onScan(decodedText);
      scanner.clear();
    });
    return () => scanner.clear();
  }, [onScan]);

  return <div id="reader" style={{ width: '100%' }}></div>;
};

export default QRScanner;
