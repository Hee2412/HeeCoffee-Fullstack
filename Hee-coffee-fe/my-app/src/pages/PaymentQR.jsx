// src/pages/PaymentQR.jsx
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CheckCircle, Clock, Copy, ArrowLeft, AlertCircle } from 'lucide-react';
import s from '../styles/PaymentQR.module.scss';

export default function PaymentQR() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = useParams();
  
  const [qrUrl, setQrUrl] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);
  const [countdown, setCountdown] = useState(900);
  const [checking, setChecking] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  const fetchQRCode = useCallback(async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const response = await axios.get(
        `http://localhost:8080/api/order/qr/${id}`,
        { 
          headers: user.token ? { 'Authorization': `Bearer ${user.token}` } : {}
        }
      );
      
      setQrUrl(response.data.data);
    } catch (error) {
      console.error('QR fetch error:', error);
      toast.error('Failed to generate QR code!');
    }
  }, []);

  const fetchOrderAndQR = useCallback(async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const orderResponse = await axios.get(
        `http://localhost:8080/api/order/orders/${id}`,
        { headers: { 'Authorization': `Bearer ${user.token}` } }
      );
      
      setOrderInfo({
        orderId: orderResponse.data.data.orderId,
        totalAmount: orderResponse.data.data.totalAmount
      });
      
      await fetchQRCode(id);
      
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load payment information!');
      navigate('/my-orders');
    }
  }, [fetchQRCode, navigate]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setIsGuest(!user.token);

    if (location.state) {
      setOrderInfo(location.state);
      fetchQRCode(location.state.orderId);
    } else if (orderId) {
      fetchOrderAndQR(orderId);
    } else {
      toast.error('Invalid payment information!');
      navigate('/cart');
    }
  }, [orderId, location.state, navigate, fetchQRCode, fetchOrderAndQR]);

  useEffect(() => {
    if (countdown <= 0) {
      toast.warning('Payment session expired!');
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleConfirmPayment = async () => {
    try {
      setChecking(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      await axios.put(
        `http://localhost:8080/api/order/${orderInfo.orderId}/pay`,
        {},
        { 
          headers: user.token ? { 'Authorization': `Bearer ${user.token}` } : {}
        }
      );
      
      toast.success('Payment confirmed successfully!');
      localStorage.removeItem('cart');
      
      navigate('/order-success', {
        state: {
          orderId: orderInfo.orderId,
          customerName: user.name || 'Guest',
          totalAmount: orderInfo.totalAmount,
          paymentMethod: 'Banking',
          isLoggedIn: !isGuest
        }
      });
      
    } catch (error) {
      console.error('Confirm payment error:', error);
      toast.error('Please complete the payment first!');
    } finally {
      setChecking(false);
    }
  };

  const handleCancel = () => {
    if (isGuest) {
      toast.info('Payment cancelled. Your cart items are still saved.');
      navigate('/cart');
    } else {
      toast.info('Payment cancelled. You can resume payment from your orders.');
      navigate('/my-orders');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={s.payment_page}>
      <button 
        className={s.back_btn} 
        onClick={() => navigate(isGuest ? '/cart' : '/my-orders')}
      >
        <ArrowLeft size={20} />
        {isGuest ? 'Back to Cart' : 'Back to My Orders'}
      </button>

      <div className={s.payment_container}>
        <div className={s.payment_header}>
          <h1>Scan QR Code to Pay</h1>
          <div className={s.timer}>
            <Clock size={20} />
            <span className={countdown < 300 ? s.warning : ''}>
              {formatTime(countdown)}
            </span>
          </div>
        </div>

        {isGuest && (
          <div className={s.info_box}>
            <AlertCircle size={20} />
            <span>
              You are checking out as a guest. 
              <strong 
                onClick={() => navigate('/login', { state: { returnTo: `/payment/${orderId}` }})} 
                style={{ cursor: 'pointer', marginLeft: '5px', textDecoration: 'underline', color: '#8B4513' }}
              >
                Login
              </strong> to track your order easily.
            </span>
          </div>
        )}

        {countdown < 300 && (
          <div className={s.warning_box}>
            <AlertCircle size={20} />
            <span>Payment session will expire soon! Please complete payment.</span>
          </div>
        )}

        <div className={s.qr_section}>
          <div className={s.qr_container}>
            {qrUrl ? (
              <img src={qrUrl} alt="QR Code" className={s.qr_image} />
            ) : (
              <div className={s.qr_placeholder}>Generating QR code...</div>
            )}
          </div>

          <div className={s.instructions}>
            <h3>Payment Instructions:</h3>
            <ol>
              <li>Open your banking app</li>
              <li>Select "Scan QR" or "Transfer"</li>
              <li>Scan the QR code above</li>
              <li>Confirm the transfer information</li>
              <li>Complete the payment</li>
              <li>Click "I've paid" button below</li>
            </ol>
          </div>
        </div>

        <div className={s.payment_info}>
          <div className={s.info_row}>
            <span className={s.label}>Order ID:</span>
            <div className={s.copy_group}>
              <span className={s.value}>#{orderInfo?.orderId}</span>
              <button 
                className={s.copy_btn}
                onClick={() => copyToClipboard(orderInfo?.orderId?.toString())}
              >
                <Copy size={16} />
              </button>
            </div>
          </div>

          <div className={s.info_row}>
            <span className={s.label}>Transfer Content:</span>
            <div className={s.copy_group}>
              <span className={s.value}>ORDER{orderInfo?.orderId}</span>
              <button 
                className={s.copy_btn}
                onClick={() => copyToClipboard(`ORDER${orderInfo?.orderId}`)}
              >
                <Copy size={16} />
              </button>
            </div>
          </div>

          <div className={`${s.info_row} ${s.amount_row}`}>
            <span className={s.label}>Amount:</span>
            <span className={s.amount}>
              {orderInfo?.totalAmount?.toLocaleString('vi-VN')}đ
            </span>
          </div>
        </div>

        <div className={s.action_buttons}>
          <button 
            className={s.confirm_btn}
            onClick={handleConfirmPayment}
            disabled={checking || countdown <= 0}
          >
            <CheckCircle size={20} />
            {checking ? 'Checking...' : "I've Paid"}
          </button>

          <button 
            className={s.cancel_btn}
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>

        <div className={s.note_box}>
          <p>
            <strong>Note:</strong> Please make sure the transfer content matches exactly: 
            <strong> ORDER{orderInfo?.orderId}</strong>
          </p>
          <p>
            After payment, please click "I've paid" button. We will verify and update your order status.
          </p>
          {isGuest && (
            <p className={s.guest_note}>
              💡 <strong>Tip:</strong> Login to easily track and manage your orders!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}