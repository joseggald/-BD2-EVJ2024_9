import React, { useState, useEffect } from 'react';
import axios from 'axios';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = localStorage.getItem('userId');
      console.log(userId);
      if (!userId) {
        setError('No user ID found in localStorage');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post('http://localhost:5000/getOrdersByUser', { user_uid: userId });
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Error fetching orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleMarkDelivered = async (orderId) => {
    try {
      const response = await axios.post('http://localhost:5000/updateStatusOrder', { order_uid: orderId });
     // const response = await axios.post('http://localhost:5000/updateStatusOrder', { order_uid: orderId, status: 'DELIVERED' });
      console.log('Order marked as delivered:', response.data);

    
      const updatedOrders = orders.map(order => {
        if (order._id === orderId) {
          return {
            ...order,
            status: 'DELIVERED'
          };
        }
        return order;
      });

      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error marking order as delivered:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="OrdersPage">
      <h2>Historial de Pedidos</h2>
      {orders.length === 0 && <p>No tiene Órdenes, lo invitamos a comprar nuestros libros para que aparezcan sus pedidos en esta ventana.</p>}
      {orders.map(order => (
        <div key={order._id} className="order-item">
          <p><strong>Número de Orden</strong> {order.order_number}</p>
          <p><strong>Descripción:</strong> {order.description}</p>
          <p><strong>Estado:</strong> {order.status}</p>
          <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
          <p><strong>Fecha de Creación:</strong> {new Date(order.created_on).toLocaleDateString()}</p>
          {order.status === 'Sent' && (
            <button onClick={() => handleMarkDelivered(order._id)}>Marcar como entregada</button>
          )}
          <hr />
        </div>
      ))}
    </div>
  );
}

export default OrdersPage;
