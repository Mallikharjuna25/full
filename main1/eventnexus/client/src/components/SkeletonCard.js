import React from 'react';

export const SkeletonCard = () => {
    return (
        <div className="event-card glass" style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
            <div className="shimmer-card" style={{ height: '160px', background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.5s infinite' }}></div>
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ height: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', animation: 'pulse 1.5s infinite', width: '80%' }}></div>
                <div style={{ height: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', animation: 'pulse 1.5s infinite', width: '60%' }}></div>
                <div style={{ height: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', animation: 'pulse 1.5s infinite', width: '90%' }}></div>
                <div style={{ marginTop: 'auto', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', animation: 'pulse 1.5s infinite' }}></div>
            </div>
            <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
        </div>
    );
};

export const SkeletonGrid = () => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
    );
};
