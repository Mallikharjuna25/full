import React, { useState, useRef, useEffect } from 'react';

const OTPInput = ({ length = 6, value, onChange, autoFocus = true }) => {
    const [otp, setOtp] = useState(new Array(length).fill(''));
    const inputRefs = useRef([]);

    useEffect(() => {
        if (autoFocus && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [autoFocus]);

    useEffect(() => {
        onChange(otp.join(''));
    }, [otp, onChange]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Move to next input
        if (element.value && index < length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                inputRefs.current[index - 1].focus();
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1].focus();
        } else if (e.key === 'ArrowRight' && index < length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, length);
        if (!/^\d+$/.test(pasteData)) return;

        const newOtp = [...otp];
        pasteData.split('').forEach((char, i) => {
            if (i < length) newOtp[i] = char;
        });
        setOtp(newOtp);

        // Focus last filled input or last input
        const lastIndex = Math.min(pasteData.length, length - 1);
        inputRefs.current[lastIndex].focus();
    };

    return (
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '20px' }}>
            {otp.map((digit, index) => (
                <input
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    style={{
                        width: '50px',
                        height: '56px',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        background: 'rgba(255,255,255,0.05)',
                        border: `2px solid ${digit ? 'var(--violet)' : 'var(--border)'}`,
                        borderRadius: '12px',
                        color: 'white',
                        outline: 'none',
                        transition: 'all 0.3s',
                        fontFamily: 'monospace'
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = 'var(--violet)';
                        e.target.style.background = 'rgba(255,255,255,0.08)';
                    }}
                    onBlur={(e) => {
                        if (!digit) {
                            e.target.style.borderColor = 'var(--border)';
                            e.target.style.background = 'rgba(255,255,255,0.05)';
                        }
                    }}
                />
            ))}
        </div>
    );
};

export default OTPInput;
