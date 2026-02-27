import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import Loader from '../../components/common/Loader';
import ReviewCard from '../../components/admin/ReviewCard';
import toast from 'react-hot-toast';
import { FiUserCheck } from 'react-icons/fi';

const StudentReviews = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingStudents = async () => {
        try {
            const { data } = await axios.get('/admin/students/pending');
            setStudents(data);
        } catch (error) {
            console.error('Failed to fetch pending students', error);
            toast.error('Failed to load pending students');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingStudents();
    }, []);

    const handleApprove = async (id) => {
        try {
            const { data } = await axios.patch(`/admin/students/${id}/approve`);
            toast.success(data.message);
            setStudents(prev => prev.filter(s => s._id !== id));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to approve');
        }
    };

    const handleReject = async (id) => {
        const reason = prompt("Enter rejection reason (this will be emailed to the student):");
        if (reason === null) return; // cancelled

        try {
            const { data } = await axios.patch(`/admin/students/${id}/reject`, { reason: reason || 'Does not meet criteria' });
            toast.success(data.message);
            setStudents(prev => prev.filter(s => s._id !== id));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reject');
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Student Reviews</h1>
                <p className="text-gray-400">Review and approve new student registrations before they can log in.</p>
            </div>

            {loading ? (
                <Loader />
            ) : students.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {students.map(student => (
                        <ReviewCard
                            key={student._id}
                            type="student"
                            user={student}
                            onApprove={() => handleApprove(student._id)}
                            onReject={() => handleReject(student._id)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-surface-card rounded-2xl border border-surface-border">
                    <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-4">
                        <FiUserCheck className="text-3xl text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-300 mb-2">No pending reviews</h3>
                    <p className="text-gray-500">All student accounts are currently processed.</p>
                </div>
            )}
        </div>
    );
};

export default StudentReviews;
