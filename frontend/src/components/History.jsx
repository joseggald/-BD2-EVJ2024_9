import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

const History = () => {
  const userRole = useSelector((state) => state.user.role);
  const userId = useSelector((state) => state.user.userId);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let response;
        if (userRole === 'Admin') {
          response = await axios.get('http://localhost:5000/getAllOrders');
        } else if (userRole === 'Client') {
          response = await axios.post('http://localhost:5000/getOrdersByUser', { user_uid: userId });
        }
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        Swal.fire('Error', 'No se pudo cargar el historial de compras.', 'error');
      }
    };

    fetchOrders();
  }, [userRole, userId]);

  const handleUpdateOrderStatus = async (orderUid, newStatus) => {
    try {
      await axios.put('http://localhost:5000/updateStatusOrder', {
        order_uid: orderUid,
        new_status: newStatus
      });
      // Actualizar localmente el estado de las órdenes después de cambiar el estado
      const updatedOrders = orders.map(order => {
        if (order._id === orderUid) {
          return { ...order, status: newStatus };
        }
        return order;
      });
      setOrders(updatedOrders);
      Swal.fire('¡Éxito!', `Estado de la orden actualizado a "${newStatus}".`, 'success');
    } catch (error) {
      console.error('Error updating order status:', error);
      Swal.fire('Error', 'No se pudo actualizar el estado de la orden.', 'error');
    }
  };

  return (
    <div className="author-container py-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-green-800 to-teal-400 text-white rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold mb-2">¡Bienvenido al Historial de Compras!</h1>
            <p className="text-lg">Aquí puedes ver y gestionar tus compras.</p>
          </div>
        </div>
        <div className="mt-8">
          {orders.length === 0 ? (
            <p className="text-center text-lg mt-4">No hay órdenes disponibles.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
              {orders.map((order) => (
                <div key={order._id} className="border border-gray-300 bg-white ml-4 mr-4 shadow-lg rounded-lg">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Orden #{order.order_number}</h2>
                    <p className="mb-2"><span className="font-semibold">Estado:</span> {order.status}</p>
                    <p className="mb-2"><span className="font-semibold">Descripción:</span> {order.description}</p>
                    <p className="mb-2"><span className="font-semibold">Total:</span> ${order.total.toFixed(2)}</p>
                    {userRole === 'Admin' && (
                      <div>
                        <p className="mb-2"><span className="font-semibold">Usuario:</span> {order.user.first_name} {order.user.last_name}</p>
                        <p className="mb-2"><span className="font-semibold">Correo Electrónico:</span> {order.user.email}</p>
                        <p className="mb-2"><span className="font-semibold">Teléfono:</span> {order.user.phone}</p>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-4">Creado el: {new Date(order.created_on).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Actualizado el: {new Date(order.update_on).toLocaleString()}</p>

                    {/* Mostrar botón según el rol y estado de la orden */}
                    {userRole === 'Admin' && order.status === 'PROCESS' && (
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mt-4"
                        onClick={() => handleUpdateOrderStatus(order._id, 'SEND')}
                      >
                        Enviar
                      </button>
                    )}
                    {userRole === 'Client' && order.status === 'SENT' && (
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg mt-4"
                        onClick={() => handleUpdateOrderStatus(order._id, 'DELIVERED')}
                      >
                        Entregado
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
