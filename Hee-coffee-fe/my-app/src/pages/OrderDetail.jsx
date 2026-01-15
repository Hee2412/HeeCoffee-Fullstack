import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ArrowLeft, MapPin, CreditCard, Calendar } from 'lucide-react';
import s from '../styles/OrderDetail.module.scss';

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.token) {
      toast.error('Please login first!');
      navigate('/login');
      return;
    }
    
    fetchOrderDetail(orderId, user.token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, navigate]);

  const fetchOrderDetail = async (id, token) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/order/orders/${id}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      setOrder(response.data.data);
    } catch (error) {
      console.error('Fetch order error:', error);
      toast.error('Failed to load order details!');
      navigate('/my-orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={s.loading}>
        <div className={s.spinner}></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className={s.detail_page}>
      <button className={s.back_btn} onClick={() => navigate('/my-orders')}>
        <ArrowLeft size={20} />
        Back to My Orders
      </button>

      <div className={s.detail_container}>
        <div className={s.detail_header}>
          <h1>Order #{order.orderId}</h1>
          <span className={`${s.status} ${s[order.status?.toLowerCase()]}`}>
            {order.status}
          </span>
        </div>

        <div className={s.info_grid}>
          <div className={s.info_card}>
            <div className={s.card_icon}>
              <Calendar size={24} />
            </div>
            <div>
              <p className={s.label}>Order Date</p>
              <p className={s.value}>
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className={s.info_card}>
            <div className={s.card_icon}>
              <CreditCard size={24} />
            </div>
            <div>
              <p className={s.label}>Payment Method</p>
              <p className={s.value}>{order.paymentMethod}</p>
            </div>
          </div>

          <div className={s.info_card}>
            <div className={s.card_icon}>
              <MapPin size={24} />
            </div>
            <div>
              <p className={s.label}>Delivery Address</p>
              <p className={s.value}>{order.guestAddress || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className={s.items_section}>
          <h2>Order Items</h2>
          <div className={s.items_table}>
            <div className={s.table_header}>
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Subtotal</span>
            </div>
            {order.items?.map((item, index) => (
              <div key={index} className={s.table_row}>
                <span className={s.product_name}>{item.productName}</span>
                <span>{item.unitPrice?.toLocaleString('vi-VN')}đ</span>
                <span>×{item.quantity}</span>
                <span className={s.subtotal}>
                  {(item.unitPrice * item.quantity).toLocaleString('vi-VN')}đ
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={s.summary_section}>
          <div className={s.summary_row}>
            <span>Subtotal:</span>
            <span>{order.totalAmount?.toLocaleString('vi-VN')}đ</span>
          </div>
          <div className={`${s.summary_row} ${s.total}`}>
            <span>Total:</span>
            <span>{order.totalAmount?.toLocaleString('vi-VN')}đ</span>
          </div>
        </div>
      </div>
    </div>
  );
}