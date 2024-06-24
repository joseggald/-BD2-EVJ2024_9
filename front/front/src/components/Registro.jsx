import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/Registro.css';

function Registro() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    rol: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Para el campo 'phone', asegúrate de que solo se ingresen números
    if (name === 'phone' && !(/^\d*$/.test(value))) {
      return; // Evita actualizar el estado si no es un número válido
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      rol: formData.rol === 'administrador' ? '6675c512a910649c4a74cb91' : '6675c538a910649c4a74cb92',
      phone: formData.phone ? parseInt(formData.phone) : ''
    };

    fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    })
    .then(response => {
      if (response.ok) {
        setSuccessMessage('Registro exitoso, Puede iniciar Sesión');
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          address: '',
          password: '',
          rol: ''
        });
      } else {
        throw new Error('Error al registrar el usuario.');
      }
    })
    .catch((error) => {
      console.error('Error:', error.message);
      setErrorMessage('Hubo un problema con el registro: ' + error.message);
    });
  };

  return (
    <div className="RegisterForm">
      <h1>Registro</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="first_name">First Name:</label>
          <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="last_name">Last Name:</label>
          <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="phone">Phone:</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} pattern="[0-9]*" />
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="rol">Role:</label>
          <select id="rol" name="rol" value={formData.rol} onChange={handleChange}>
            <option value="">Select Role</option>
            <option value="administrador">Administrador</option>
            <option value="cliente">Cliente</option>
          </select>
        </div>
        <button type="submit">Register</button>
        <Link to="/" className="btn btn-danger border rounded-50 text-decoration-none">Regresar</Link>
      </form>
      {successMessage && <p>{successMessage}</p>}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}

export default Registro;
