import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Usuario:', username);
    console.log('Contraseña:', password);

    try {
      const response = await axios.post('http://localhost:5000/login', {
        email: username,
        password: password,
    
      });

      console.log('Información enviada al backend:', response.config);
      if (response.status === 200) {
        const data = response.data;
        console.log('Sesión iniciada correctamente');
        
        // Guardar el ID del usuario en localStorage
        localStorage.setItem('userId', data.userData[0].id);
        localStorage.setItem('userRole', data.rol);
        //console.log("AQUI "+JSON.stringify(data, null, 2))
        setSuccessMessage('Registro exitoso');
        setErrorMessage('');

        // Redirigir basado en el rol
        if (data.rol === 'Admin') {
          navigate('/MenuAdmin');
        } else {
          navigate('/UserProfile');
        }
      } else {
        setErrorMessage('Error al iniciar sesión');
        setSuccessMessage('');
        console.error('Error al iniciar sesión');
      }
    } catch (error) {
      setErrorMessage('Error al comunicarse con la API');
      setSuccessMessage('');
      console.error('Error al comunicarse con la API', error);
    }
  };

  return (
    <div className="Login">
      <div className="login-container">
        <div className="login-form">
          <h2>Login</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
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
