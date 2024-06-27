import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import '../styles/carrito.css';
const ShoppingCart = () => {
  const [carrito, setCarrito] = useState({ order: [], products: [] });
  const [cargando, setCargando] = useState(true);
  const [productoEditando, setProductoEditando] = useState(null);
  const [cantidadEditando, setCantidadEditando] = useState(1);
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
  }, [userId, productoEditando]); // Agregado productoEditando como dependencia para actualizar cuando cambie

  const eliminarProducto = async (productId) => {
    try {
      await axios.post(`http://localhost:5000/deleteProductFromCart`,{
          product_uid: productId,
      });
      // Actualizar el carrito después de eliminar el producto
      const updatedProducts = carrito.products.filter((producto) => producto._id !== productId);
      setCarrito({ ...carrito, products: updatedProducts });
      Swal.fire('¡Éxito!', 'Producto eliminado correctamente.', 'success');
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
    }
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

      // Actualizar el carrito después de editar el producto
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

  if (cargando) {
    return <div className="text-center mt-8">Cargando...</div>;
  }

  return (
    
     <div className="carrito-container overflow-hidde">
       <h2 className="text-2xl font-bold mb-4">Resumen de la Orden</h2>
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
       <h3 className="text-2xl font-bold mb-4">Productos</h3>
       <ul>
         {carrito.products.map((producto) => (
           <li key={producto.order_uid} className="bg-white shadow-md rounded-lg p-4 mb-4">
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
                   className="ml-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                   onClick={handleSubmitEditarProducto}
                 >
                   Actualizar
                 </button>
               </div>
             )}
           </li>
         ))}
       </ul>
     </div>
   );
};

export default ShoppingCart;
