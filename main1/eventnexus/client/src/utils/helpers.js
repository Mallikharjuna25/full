export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

export const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hourString, minute] = timeString.split(':');
    const hour = parseInt(hourString);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
};

export const getCategoryColor = (category) => {
    const colors = {
        Tech: '#3B82F6',
        Cultural: '#EC4899',
        Sports: '#F59E0B',
        Business: '#10B981',
        Science: '#8B5CF6',
        Hackathon: '#F43F5E',
        Workshop: '#06B6D4',
        Other: '#94A3B8'
    };
    return colors[category] || colors.Other;
};

export const getCategoryEmoji = (category) => {
    const emojis = {
        Tech: '💻',
        Cultural: '🎭',
        Sports: '🏆',
        Business: '💼',
        Science: '🔬',
        Hackathon: '🚀',
        Workshop: '🛠️',
        Other: '✨'
    };
    return emojis[category] || emojis.Other;
};

export const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
};

export const downloadQRCode = (dataURL, filename) => {
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = filename || 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const getRegistrationStatusColor = (status) => {
    switch (status) {
        case 'confirmed': return '#10B981'; // Green
        case 'pending': return '#F59E0B'; // Yellow
        case 'cancelled': return '#EF4444'; // Red
        default: return '#94A3B8';
    }
};

export const daysUntilEvent = (dateString) => {
    const eventDate = new Date(dateString);
    eventDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Past';
    if (diffDays === 0) return 'Today!';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days`;
};

export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};
