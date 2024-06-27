import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MenuAdmin() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('No user ID found in localStorage');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post('http://localhost:5000/getUserById', { id: userId });
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          const user = response.data[0];
          setUserData(user);
          setFormData({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
            address: user.address,
          });
        } else {
          setError('User data is not in the expected format');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error fetching user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    try {
      const response = await axios.put(`http://localhost:5000/updateProfile/${userId}`, formData);
      console.log('User updated successfully', response.data);
      // Update the userData state with the updated information
      if (response.data && response.data.user) {
        setUserData(response.data.user); // Asegúrate de que el backend devuelve los datos actualizados
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>No user data available</div>;
  }

  return (
    <div className="UserProfile">
      <h2>Perfil de Usuario</h2>
      <p><strong>First Name:</strong> {userData.first_name}</p>
      <p><strong>Last Name:</strong> {userData.last_name}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Phone:</strong> {userData.phone}</p>
      <p><strong>Address:</strong> {userData.address}</p>
      
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Ocultar' : 'Actualizar datos'}
      </button>
      
      {showForm && (
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
            <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="address">Address:</label>
            <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} />
          </div>
          <button type="submit">Actualizar Datos</button>
        </form>
      )}
    </div>
  );
}

export default MenuAdmin;
