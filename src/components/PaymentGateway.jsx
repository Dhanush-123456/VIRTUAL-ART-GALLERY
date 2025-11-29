import React, { useState } from 'react';
import api from '../services/api';

const PaymentGateway = ({ cart, total, onSuccess, onCancel }) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success', 'failed', or null

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 3);
    }

    setPaymentData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!paymentData.cardNumber.replace(/\s/g, '')) {
      newErrors.cardNumber = 'Card number is required';
    } else if (paymentData.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Card number must be at least 13 digits';
    }

    if (!paymentData.cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
    }

    if (!paymentData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else {
      const [month, year] = paymentData.expiryDate.split('/');
      if (!month || !year || month.length !== 2 || year.length !== 2) {
        newErrors.expiryDate = 'Invalid format (MM/YY)';
      } else {
        const monthNum = parseInt(month);
        const yearNum = parseInt('20' + year);
        const currentDate = new Date();
        const expiryDate = new Date(yearNum, monthNum - 1);
        if (monthNum < 1 || monthNum > 12) {
          newErrors.expiryDate = 'Invalid month';
        } else if (expiryDate < currentDate) {
          newErrors.expiryDate = 'Card has expired';
        }
      }
    }

    if (!paymentData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (paymentData.cvv.length < 3) {
      newErrors.cvv = 'CVV must be 3 digits';
    }

    if (!paymentData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsProcessing(true);
    setPaymentStatus(null);

    try {
      // API call for payment processing
      const response = await api.processPayment({
        amount: total,
        cardNumber: paymentData.cardNumber.replace(/\s/g, ''),
        cardHolder: paymentData.cardName,
        expiryDate: paymentData.expiryDate,
        cvv: paymentData.cvv,
        email: paymentData.email,
        items: cart
      });

      setIsProcessing(false);
      setPaymentStatus('success');

      // Wait a bit before calling onSuccess to show success message
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      setIsProcessing(false);
      setPaymentStatus('failed');
      setErrors({ general: err.message || 'Payment processing failed. Please try again.' });
    }
  };

  if (paymentStatus === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
        <h2 style={{ color: '#4CAF50', marginBottom: '1rem' }}>Payment Successful!</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Your order has been processed successfully. A confirmation email will be sent to {paymentData.email}
        </p>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          Order Total: <strong>${total.toLocaleString()}</strong>
        </p>
        <p style={{ color: '#999', fontSize: '0.85rem', marginTop: '1rem' }}>
          Redirecting...
        </p>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
        <h2 style={{ color: '#e74c3c', marginBottom: '1rem' }}>Payment Failed</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Your payment could not be processed. Please check your card details and try again.
        </p>
        <button
          onClick={() => {
            setPaymentStatus(null);
            setErrors({});
          }}
          style={{
            padding: '0.75rem 2rem',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '1rem'
          }}
        >
          Try Again
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: '0.75rem 2rem',
            background: '#e1e5e9',
            color: '#333',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '1rem',
            marginLeft: '1rem'
          }}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '1rem' }}>
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '0.5rem', color: '#333' }}>Secure Payment</h2>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          Complete your purchase of {cart.length} item{cart.length !== 1 ? 's' : ''}
        </p>
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '5px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#666' }}>Subtotal:</span>
            <span style={{ fontWeight: '500' }}>${total.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#666' }}>Processing Fee:</span>
            <span style={{ fontWeight: '500' }}>$0.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '2px solid #ddd', marginTop: '0.5rem' }}>
            <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>Total:</span>
            <span style={{ fontWeight: '700', fontSize: '1.2rem', color: '#667eea' }}>${total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {errors.general && (
          <div style={{
            padding: '0.75rem',
            background: '#fee',
            border: '1px solid #e74c3c',
            borderRadius: '5px',
            color: '#e74c3c',
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            {errors.general}
          </div>
        )}
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '500' }}>
            Card Number *
          </label>
          <input
            type="text"
            name="cardNumber"
            value={paymentData.cardNumber}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: errors.cardNumber ? '2px solid #e74c3c' : '2px solid #e1e5e9',
              borderRadius: '5px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
          {errors.cardNumber && (
            <span style={{ display: 'block', color: '#e74c3c', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              {errors.cardNumber}
            </span>
          )}
        </div>

        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '500' }}>
            Cardholder Name *
          </label>
          <input
            type="text"
            name="cardName"
            value={paymentData.cardName}
            onChange={handleChange}
            placeholder="John Doe"
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: errors.cardName ? '2px solid #e74c3c' : '2px solid #e1e5e9',
              borderRadius: '5px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
          {errors.cardName && (
            <span style={{ display: 'block', color: '#e74c3c', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              {errors.cardName}
            </span>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '500' }}>
              Expiry Date *
            </label>
            <input
              type="text"
              name="expiryDate"
              value={paymentData.expiryDate}
              onChange={handleChange}
              placeholder="MM/YY"
              maxLength="5"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.expiryDate ? '2px solid #e74c3c' : '2px solid #e1e5e9',
                borderRadius: '5px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
            {errors.expiryDate && (
              <span style={{ display: 'block', color: '#e74c3c', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                {errors.expiryDate}
              </span>
            )}
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '500' }}>
              CVV *
            </label>
            <input
              type="text"
              name="cvv"
              value={paymentData.cvv}
              onChange={handleChange}
              placeholder="123"
              maxLength="3"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.cvv ? '2px solid #e74c3c' : '2px solid #e1e5e9',
                borderRadius: '5px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
            {errors.cvv && (
              <span style={{ display: 'block', color: '#e74c3c', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                {errors.cvv}
              </span>
            )}
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '500' }}>
            Email for Receipt *
          </label>
          <input
            type="email"
            name="email"
            value={paymentData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: errors.email ? '2px solid #e74c3c' : '2px solid #e1e5e9',
              borderRadius: '5px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
          {errors.email && (
            <span style={{ display: 'block', color: '#e74c3c', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              {errors.email}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="submit"
            disabled={isProcessing}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: isProcessing ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {isProcessing ? (
              <span>
                <span style={{ display: 'inline-block', marginRight: '0.5rem' }}>⏳</span>
                Processing...
              </span>
            ) : (
              `Pay $${total.toLocaleString()}`
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#e1e5e9',
              color: '#333',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Cancel
          </button>
        </div>

        <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f0f7ff', borderRadius: '5px', fontSize: '0.85rem', color: '#666', textAlign: 'center' }}>
          🔒 Your payment information is secure and encrypted
        </div>
      </form>
    </div>
  );
};

export default PaymentGateway;

