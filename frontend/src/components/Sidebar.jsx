import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/userActions';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const links = [
    { name: 'Mi perfil', path: '/dashboard/mi-perfil' },
    { name: 'Autores', path: '/dashboard/autores' },
    { name: 'Libros', path: '/dashboard/libros' },
    { name: 'Historial de compras', path: '/dashboard/historial-compras' },
    { name: 'Reportes', path: '/dashboard/reportes' },
    { name: 'Cerrar sesión', action: handleLogout }, // Nuevo enlace para logout
  ];

  return (
    <div className="w-64 h-full shadow-lg bg-gray-800 text-white px-4 py-6 absolute left-0">
      <ul className="space-y-3">
        {links.map((link, index) => (
          <li key={index} className="relative">
            {link.path && (
              <Link to={link.path} className="flex items-center p-2 transition duration-150 ease-in-out rounded-lg hover:bg-gray-700">
                {link.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
      <div className="absolute bottom-4 left-4">
        <button onClick={handleLogout} className="bg-red-500 w-52 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
