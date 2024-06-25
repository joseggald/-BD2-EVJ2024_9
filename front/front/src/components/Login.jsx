import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Usuario:', username);
    console.log('Contraseña:', password);

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Sesión iniciada correctamente');
        
        // Guardar el ID del usuario en localStorage
        localStorage.setItem('userId', data.userData[0].id);

        // Redirigir basado en el rol
        if (data.rol === 'Admin') {
          //navigate('/admin');
          console.log('Bienvenido Admin');
        } else {
          //navigate('/client');
          console.log('Bienvenido Cliente');
        }
      } else {
        console.error('Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error al comunicarse con la API', error);
    }
  };

  return (
    <div className="Login">
      <div className="login-container">
        <div className="login-form">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">E-mail:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="off"
            />
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Iniciar sesión</button>
            <Link to="/Registro" className="btnregistro">
              Registrarme
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
