import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import Modal from 'react-modal';
import '../styles/carrito.css';

const ShoppingCart = () => {
  const [carrito, setCarrito] = useState({ order: [], products: [] });
  const [cargando, setCargando] = useState(true);
  const [productoEditando, setProductoEditando] = useState(null);
  const [cantidadEditando, setCantidadEditando] = useState(1);
  const [modalAbierto, setModalAbierto] = useState(false);
  const userId = useSelector((state) => state.user.userId);

  useEffect(() => {
    const obtenerResumenOrden = async () => {
      try {
        const userResponse = await axios.post('http://localhost:5000/getUserById', { id: userId });
        const respuesta = await axios.post('http://localhost:5000/getOrderResume', {
          order_uid: userResponse.data[0].shopping_cart,
        });
        setCarrito(respuesta.data);
      } catch (error) {
        console.error('Error al obtener el resumen de la orden:', error);
      } finally {
        setCargando(false);
      }
    };

    obtenerResumenOrden();
  }, [userId, productoEditando]);

  const eliminarProducto = async (productId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(`http://localhost:5000/deleteProductFromCart`, {
            product_uid: productId,
          });
          const updatedProducts = carrito.products.filter((producto) => producto._id !== productId);
          setCarrito({ ...carrito, products: updatedProducts });
          Swal.fire('¡Éxito!', 'Producto eliminado correctamente.', 'success');
        } catch (error) {
          console.error('Error al eliminar el producto:', error);
          Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
        }
      }
    });
  };

  const iniciarEdicionProducto = (producto) => {
    setProductoEditando(producto);
    setCantidadEditando(producto.quantity);
  };

  const handleChangeCantidad = (e) => {
    setCantidadEditando(parseInt(e.target.value));
  };

  const handleSubmitEditarProducto = async () => {
    try {
      await axios.put(`http://localhost:5000/updateProductFromCart`, {
        product_uid: productoEditando._id,
        quantity: cantidadEditando,
      });
      const updatedProducts = carrito.products.map((producto) => {
        if (producto._id === productoEditando._id) {
          return { ...producto, quantity: cantidadEditando };
        }
        return producto;
      });

      setCarrito({ ...carrito, products: updatedProducts });

      Swal.fire('¡Éxito!', 'Producto actualizado correctamente.', 'success');
      setProductoEditando(null);
    } catch (error) {
      console.error('Error al actualizar el producto', error);
      Swal.fire('Error', 'No se pudo actualizar el producto.', 'error');
    }
  };

  const handleConfirmOrder = async () => {
    try {
      await axios.put('http://localhost:5000/updateStatusOrder', {
        order_uid: carrito.order[0]._id,
      });
      Swal.fire({
        icon: 'success',
        title: '¡Orden Confirmada!',
        text: 'Se ha confirmado la orden correctamente.',
      }).then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      });
    } catch (error) {
      console.error('Error al confirmar la orden:', error);
      Swal.fire('Error', 'No se pudo confirmar la orden.', 'error');
    }
  };

  const abrirModal = () => {
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  const handleAgregarNuevoCarrito = async () => {
    if (carrito.order.length > 0) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Crearás un nuevo carrito y eliminarás el actual.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, crear nuevo carrito'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.post('http://localhost:5000/addShoppingCart', { user_uid: userId });
            Swal.fire('¡Éxito!', 'Se ha creado un nuevo carrito.', 'success');
            setTimeout(() => { window.location.reload(); }, 1700);
          } catch (error) {
            console.error('Error al crear nuevo carrito:', error);
            Swal.fire('Error', 'No se pudo crear un nuevo carrito.', 'error');
          }
        }
      });
    } else {
      try {
        await axios.post('http://localhost:5000/addShoppingCart', { user_uid: userId });
        Swal.fire('¡Éxito!', 'Se ha creado un nuevo carrito.', 'success');
        setTimeout(() => { window.location.reload(); }, 1700);
      } catch (error) {
        console.error('Error al crear nuevo carrito:', error);
        Swal.fire('Error', 'No se pudo crear un nuevo carrito.', 'error');
      }
    }
  };

  if (cargando) {
    return <div className="text-center mt-8">Cargando...</div>;
  }

  return (
    <div className="carrito-container overflow-hidden">
      <button
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md mb-4 w-72"
        onClick={handleAgregarNuevoCarrito}
      >
        Agregar Nuevo Carrito
      </button>
      <h2 className="text-2xl font-bold mb-4">Resumen de la Orden</h2>
      {carrito.order.length === 0 ? (
        <p>No tienes ningún carrito actualmente.</p>
      ) : (
        <>
          {carrito.order.map((orden) => (
            <div key={orden._id} className="bg-gray-100 rounded-lg p-4 mb-4 border border-gray-300">
              <h3 className="text-xl font-semibold">Orden #{orden.order_number}</h3>
              <p className="text-gray-600">Estado: {orden.status}</p>
              <p className="text-gray-600">Total: ${orden.total.toFixed(2)}</p>
              <p className="text-gray-600">Creada el: {new Date(orden.created_on).toLocaleDateString()}</p>
              <p className="text-gray-600">Última actualización: {new Date(orden.update_on).toLocaleDateString()}</p>
            </div>
          ))}
          <h3 className="text-2xl font-bold mb-4">Productos</h3>
          <ul>
            {carrito.products.map((producto) => (
              <li key={producto.order_uid} className="bg-white border border-gray-300 shadow-md rounded-lg p-4 mb-4">
                <h4 className="text-xl font-semibold">{producto.book.title}</h4>
                <p className="text-gray-600">{producto.book.description}</p>
                <p className="text-gray-600">Cantidad: {producto.quantity}</p>
                <p className="text-gray-600">Total: ${producto.total.toFixed(2)}</p>
                <p className="text-gray-600">Autor: {producto.author.first_name} {producto.author.last_name}</p>
                <div className="mt-4">
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mr-2"
                    onClick={() => eliminarProducto(producto._id)}
                  >
                    Eliminar
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                    onClick={() => iniciarEdicionProducto(producto)}
                  >
                    Editar
                  </button>
                </div>
                {productoEditando && productoEditando._id === producto._id && (
                  <div className="mt-4">
                    <input
                      type="number"
                      value={cantidadEditando}
                      onChange={handleChangeCantidad}
                      className="mt-2 px-2 py-1 border rounded-md"
                    />
                    <button
                      className="mt-2 ml-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                      onClick={handleSubmitEditarProducto}
                    >
                      Actualizar
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-4 justify-center">
            {carrito.products.length > 0 && carrito.order[0].total > 0 && (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mr-4 w-72"
                onClick={abrirModal}
              >
                Confirmar Orden
              </button>
            )}
          </div>
        </>
      )}

      {/* Modal para confirmar la orden */}
      <Modal
        isOpen={modalAbierto}
        onRequestClose={cerrarModal}
        className="Modal"
        overlayClassName="Overlay"
        contentLabel="Confirmar Orden"
      >
        <div className="modal-content p-4">
          <h2 className="text-2xl font-bold mb-4">Confirmar Orden</h2>
          <h3 className="text-xl font-semibold">Resumen de la Orden</h3>
          {carrito.order.map((orden) => (
            <div key={orden._id} className="bg-gray-100 rounded-lg p-4 mb-4">
              <h3 className="text-xl font-semibold">Orden #{orden.order_number}</h3>
              <p className="text-gray-600">Descripción: {orden.description || "No proporcionada"}</p>
              <p className="text-gray-600">Estado: {orden.status}</p>
              <p className="text-gray-600">Total: ${orden.total.toFixed(2)}</p>
              <p className="text-gray-600">Creada el: {new Date(orden.created_on).toLocaleDateString()}</p>
              <p className="text-gray-600">Última actualización: {new Date(orden.update_on).toLocaleDateString()}</p>
            </div>
          ))}
          <h3 className="text-xl font-semibold">Productos</h3>
          <ul>
            {carrito.products.map((producto) => (
              <li key={producto.order_uid} className="bg-white shadow-md rounded-lg p-4 mb-4">
                <h4 className="text-xl font-semibold">{producto.book.title}</h4>
                <p className="text-gray-600">{producto.book.description}</p>
                <p className="text-gray-600">Cantidad: {producto.quantity}</p>
                <p className="text-gray-600">Total: ${producto.total.toFixed(2)}</p>
                <p className="text-gray-600">Autor: {producto.author.first_name} {producto.author.last_name}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mr-4"
              onClick={handleConfirmOrder}
            >
              Confirmar Orden
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              onClick={cerrarModal}
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ShoppingCart;
