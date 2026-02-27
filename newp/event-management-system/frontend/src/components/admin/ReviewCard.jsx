import { motion } from 'framer-motion';
import { FiCheck, FiX, FiUser } from 'react-icons/fi';

const ReviewCard = ({ user, type, onApprove, onReject, isProcessing }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card border-l-4 border-l-orange-500"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-surface-card flex items-center justify-center border border-surface-border shrink-0">
                        <FiUser className="text-gray-400 text-xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1">
                            {type === 'student' ? user.name : user.collegeName}
                        </h3>
                        <p className="text-sm text-gray-400 mb-2">{user.email}</p>

                        <div className="flex flex-wrap gap-2 mt-3">
                            {type === 'student' ? (
                                <>
                                    <span className="text-xs bg-primary/20 text-primary-light px-2 py-1 rounded-md border border-primary/20">{user.collegeName}</span>
                                    <span className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-md border border-white/10">{user.branch} • {user.graduationYear}</span>
                                    <span className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-md border border-white/10">Reg: {user.registerNumber}</span>
                                </>
                            ) : (
                                <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-md border border-accent/20">Location: {user.place}</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={() => onReject(user._id)}
                        disabled={isProcessing}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                    >
                        <FiX /> Reject
                    </button>
                    <button
                        onClick={() => onApprove(user._id)}
                        disabled={isProcessing}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/50 text-green-500 hover:bg-green-500 hover:text-white transition-colors disabled:opacity-50"
                    >
                        <FiCheck /> Approve
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ReviewCard;
