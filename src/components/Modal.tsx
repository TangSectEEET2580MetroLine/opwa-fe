import React from 'react';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="card" style={{ minWidth: 350, maxWidth: 420, position: 'relative' }}>
        {children}
        <button className="outline" style={{ position: 'absolute', top: 8, right: 8 }} onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default Modal;