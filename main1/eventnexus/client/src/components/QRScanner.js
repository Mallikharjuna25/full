import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { registrationsAPI } from '../services/api';
import toast from 'react-hot-toast';

const QRScanner = ({ eventId, onScanSuccess, onScanError }) => {
    const [scanResult, setScanResult] = useState(null);
    const [statusColor, setStatusColor] = useState('rgba(0,0,0,0)');
    const [isProcessing, setIsProcessing] = useState(false);
    const scannerRef = useRef(null);

    useEffect(() => {
        scannerRef.current = new Html5QrcodeScanner(
            "qr-reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
        );

        scannerRef.current.render(onScan, onError);

        return () => {
            scannerRef.current?.clear().catch(error => console.error("Failed to clear html5QrcodeScanner. ", error));
        };
        // eslint-disable-next-line
    }, []);

    const onScan = async (decodedText) => {
        if (isProcessing) return;
        setIsProcessing(true);

        try {
            const { data } = await registrationsAPI.scanQR({ qrData: decodedText });

            if (data.alreadyScanned) {
                setStatusColor('rgba(245, 158, 11, 0.9)'); // Orange
                setScanResult({ type: 'warning', message: 'Already checked in', user: data.user });
                toast('Already checked in', { icon: '⚠️' });
            } else {
                setStatusColor('rgba(16, 185, 129, 0.9)'); // Green
                setScanResult({ type: 'success', message: 'Entry Confirmed', user: data.user });
                toast.success('Entry Confirmed');
                if (onScanSuccess) onScanSuccess(data);
            }
        } catch (err) {
            console.error(err);
            setStatusColor('rgba(239, 68, 68, 0.9)'); // Red
            const msg = err.response?.data?.message || 'Scan Failed';
            setScanResult({ type: 'error', message: msg });
            toast.error(msg);
            if (onScanError) onScanError(err);
        }

        // Reset after 3 seconds
        setTimeout(() => {
            setScanResult(null);
            setStatusColor('rgba(0,0,0,0)');
            setIsProcessing(false);
        }, 3000);
    };

    const onError = (err) => {
        // Ignore frequent scan errors when no QR is in frame
    };

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: '500px', margin: '0 auto', borderRadius: '18px', overflow: 'hidden' }} className="glass">

            <div id="qr-reader" style={{ width: '100%', border: 'none' }}></div>

            {scanResult && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: statusColor,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    zIndex: 10,
                    padding: '20px',
                    textAlign: 'center',
                    backdropFilter: 'blur(5px)'
                }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>{scanResult.message}</h2>
                    {scanResult.user && (
                        <div style={{ background: 'rgba(0,0,0,0.5)', padding: '15px', borderRadius: '12px', width: '100%' }}>
                            <p><strong>Name:</strong> {scanResult.user.name}</p>
                            <p><strong>College:</strong> {scanResult.user.college}</p>
                            <p><strong>Phone:</strong> {scanResult.user.phone}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Manual Entry Fallback could go here if needed */}
            <style>{`
        #qr-reader { border: none !important; }
        #qr-reader img { display: none; }
        #qr-reader__dashboard_section_csr span { color: var(--text-primary) !important; }
        #qr-reader__dashboard_section_csr button { background: var(--violet); color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; margin-top: 10px; }
      `}</style>
        </div>
    );
};

export default QRScanner;
