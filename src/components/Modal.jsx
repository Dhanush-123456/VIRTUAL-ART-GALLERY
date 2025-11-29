import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, content }) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="modal" 
      style={{ 
        display: 'block',
        position: 'fixed',
        zIndex: 1000,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        overflow: 'auto',
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(5px)'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="modal-content"
        style={{
          backgroundColor: '#fefefe',
          margin: '5% auto',
          padding: '2rem',
          border: '1px solid #888',
          width: '90%',
          maxWidth: '800px',
          borderRadius: '10px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          maxHeight: '85vh',
          overflowY: 'auto',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <span 
          className="close" 
          onClick={onClose}
          style={{
            color: '#aaa',
            float: 'right',
            fontSize: '28px',
            fontWeight: 'bold',
            cursor: 'pointer',
            position: 'absolute',
            right: '1rem',
            top: '1rem',
            lineHeight: '1'
          }}
          onMouseOver={(e) => e.target.style.color = '#000'}
          onMouseOut={(e) => e.target.style.color = '#aaa'}
        >
          &times;
        </span>
        <div id="tour-content" style={{ marginTop: '1rem' }}>
          {content}
        </div>
      </div>
    </div>
  );
};

export default Modal;