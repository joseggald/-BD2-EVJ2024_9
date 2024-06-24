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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setSuccessMessage('Registro exitoso.');
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
        setSuccessMessage('Hubo un problema con el registro.');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      setSuccessMessage('Hubo un problema con el registro.');
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
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
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
    </div>
  );
}

export default Registro;
