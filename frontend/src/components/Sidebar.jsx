import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/userActions'; // Asegúrate de importar la acción de logout
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
    { name: 'Historial de compras', path: '/historial-compras' },
    { name: 'Reportes', path: '/reportes' },
    { name: 'Cerrar sesión', action: handleLogout }, // Nuevo enlace para logout
  ];

  return (
    <div className="w-64 h-full shadow-lg bg-gray-800 text-white px-4 py-6 absolute left-0"> {/* Añade left-0 para fijar a la izquierda */}
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index} className="relative">
            {link.path ? (
              <Link to={link.path} className="flex items-center p-2 transition duration-150 ease-in-out rounded-lg hover:bg-gray-700">
                {link.name}
              </Link>
            ) : (
              <button onClick={link.action} className="flex items-center p-2 w-full text-left transition duration-150 ease-in-out rounded-lg hover:bg-gray-700">
                {link.name}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
