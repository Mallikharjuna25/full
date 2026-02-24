import QRCode from 'qrcode.react';

export const generateQRCode = (value) => {
  return <QRCode value={value} size={256} />;
};
