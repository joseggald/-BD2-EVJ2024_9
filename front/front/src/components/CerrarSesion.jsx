
import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
   
    navigate('/Login');
  };

  return (
    <button onClick={handleLogout}>
      Cerrar sesión
    </button>
  );
}

export default LogoutButton;
