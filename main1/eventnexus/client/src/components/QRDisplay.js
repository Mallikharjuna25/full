import React from 'react';
import { downloadQRCode, formatDate } from '../utils/helpers';
import { Download, Printer } from 'lucide-react';

const QRDisplay = ({ qrCodeImage, registrationId, eventTitle, eventDate, venue }) => {
    if (!qrCodeImage) return null;

    return (
        <div className="glass" style={{ padding: '30px', textAlign: 'center', borderRadius: '18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <h3 style={{ color: 'var(--cyan)' }}>Your Entry Pass</h3>

            <div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{eventTitle}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{formatDate(eventDate)} • {venue}</p>
            </div>

            <div style={{ background: 'white', padding: '15px', borderRadius: '12px', display: 'inline-block', margin: '15px 0' }}>
                <img src={qrCodeImage} alt="Entry QR Code" style={{ width: '200px', height: '200px', display: 'block' }} />
            </div>

            <p style={{ fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '13px', letterSpacing: '1px' }}>
                ID: {registrationId}
            </p>

            <p style={{ fontSize: '14px' }}>Show this at the event entrance to verify your registration.</p>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px', width: '100%' }}>
                <button
                    className="btn-primary"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    onClick={() => downloadQRCode(qrCodeImage, `${eventTitle.replace(/\s+/g, '_')}_Pass.png`)}
                >
                    <Download size={18} /> Download
                </button>
                <button
                    className="btn-outline"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    onClick={() => window.print()}
                >
                    <Printer size={18} /> Print
                </button>
            </div>

            <style>{`
        @media print {
          body * { visibility: hidden; }
          .glass, .glass * { visibility: visible; color: black !important; }
          .glass { position: absolute; left: 0; top: 0; width: 100%; border: none; background: white; }
          .btn-primary, .btn-outline { display: none !important; }
        }
      `}</style>
        </div>
    );
};

export default QRDisplay;
