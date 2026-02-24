const qrcode = require('qrcode');
const uuid = require('uuid');

const generateQRToken = () => {
    return uuid.v4();
};

const generateQRImage = async (data) => {
    try {
        const qrImage = await qrcode.toDataURL(JSON.stringify(data), {
            errorCorrectionLevel: 'H',
            width: 400,
            margin: 2
        });
        return qrImage;
    } catch (err) {
        console.error('Error generating QR', err);
        throw err;
    }
};

const decodeQRData = (qrString) => {
    try {
        return JSON.parse(qrString);
    } catch (err) {
        throw new Error('Invalid QR Data');
    }
};

module.exports = { generateQRToken, generateQRImage, decodeQRData };
