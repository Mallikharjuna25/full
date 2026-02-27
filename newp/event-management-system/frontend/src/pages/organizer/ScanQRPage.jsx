import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import QRScanner from '../../components/organizer/QRScanner';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import Loader from '../../components/common/Loader';

const ScanQRPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastScanned, setLastScanned] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await axios.get(`/events/${id}`);
                setEvent(data);
            } catch (error) {
                toast.error("Failed to load event");
                navigate('/organizer/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id, navigate]);

    const handleScan = async (scannedString) => {
        try {
            const { data } = await axios.post(`/organizer/events/${id}/scan`, { qrData: scannedString });
            toast.success(data.message || 'Attendance marked successfully!');
            setLastScanned({
                success: true,
                message: 'Entry Verified',
                studentName: data.studentName,
                time: new Date().toLocaleTimeString()
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid QR Code or already scanned');
            setLastScanned({
                success: false,
                message: error.response?.data?.message || 'Verification Failed',
                time: new Date().toLocaleTimeString()
            });
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="max-w-2xl mx-auto">
            <button
                onClick={() => navigate('/organizer/dashboard')}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
            >
                <FiArrowLeft /> Back to Dashboard
            </button>

            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Scan Entry Pass</h1>
                <p className="text-accent">{event?.title}</p>
            </div>

            <div className="mb-10">
                <QRScanner onScan={handleScan} />
            </div>

            {lastScanned && (
                <div className={`p-6 rounded-2xl border text-center transition-all ${lastScanned.success
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                    }`}>
                    <div className="flex justify-center mb-3">
                        {lastScanned.success ? (
                            <FiCheckCircle className="text-4xl text-green-500" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xl">X</div>
                        )}
                    </div>
                    <h3 className={`text-xl font-bold mb-1 ${lastScanned.success ? 'text-green-500' : 'text-red-500'}`}>
                        {lastScanned.message}
                    </h3>
                    {lastScanned.studentName && (
                        <p className="text-white font-medium mb-1">Student: {lastScanned.studentName}</p>
                    )}
                    <p className="text-sm text-gray-500">Time: {lastScanned.time}</p>
                </div>
            )}
        </div>
    );
};

export default ScanQRPage;
