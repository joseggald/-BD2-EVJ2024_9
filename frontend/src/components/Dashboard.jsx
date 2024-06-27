import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ShoppingCart from './ShoppingCart'; // Asegúrate de tener este componente
import '../styles/sidebar.css'; // Importa los estilos necesarios

const Dashboard = () => {
  const userRole = useSelector((state) => state.user.role);

  return (
    <div className="dashboard-container flex h-screen overflow-hidden"> {/* Ajustado para ocultar los scrolls */}
      <div className="sidebar w-64">
        <Sidebar />
      </div>
      <div className="content flex-1 px-4"> {/* Ajustes de padding y scroll oculto */}
        <Outlet /> {/* Esto renderizará el componente correspondiente a la ruta anidada */}
      </div>
      {/* Solo muestra el Carrito si el usuario es un cliente */}
      {userRole === 'Client' && (
        <div className="carrito w-80 overflow-hidden"> {/* Ajuste de ancho */}
          <ShoppingCart />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
