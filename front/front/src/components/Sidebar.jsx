// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './CerrarSesion';

function Sidebar() {
  const userRole = localStorage.getItem('userRole'); // O obtén el rol del usuario de tu estado global

  return (
    <div className="sidebar">
      <ul>
        {userRole === 'admin' ? (
          <>
            <li><Link to="/AddBook">Add Book</Link></li>
            <li><Link to="/UpdateBook">Update Book</Link></li>
            <li><Link to="/DeleteBook">Delete Book</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/UserProfile">Mi Perfil</Link></li>
            <li><Link to="/OrdersPage">Historial de Pedidos</Link></li>
          </>
        )}
         <li>
          <LogoutButton />
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
