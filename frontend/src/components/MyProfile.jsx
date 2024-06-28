import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

const MyProfile = () => {
  const userId = useSelector((state) => state.user.userId);
  const [usuario, setUsuario] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    rol: '',
    address: '', // Agregado campo de dirección
  });
  const [roles, setRoles] = useState([]);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.post('http://localhost:5000/getUserById', { id: userId });
        const rolesResponse = await axios.get('http://localhost:5000/getRoles');
        setUsuario(userResponse.data[0]);
        setRoles(rolesResponse.data);
      } catch (error) {
        console.error('Error al cargar los datos', error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = () => setEditando(!editando);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/updateProfile/${userId}`, usuario);
      Swal.fire('¡Éxito!', 'Perfil actualizado correctamente.', 'success');
      setEditando(false);
    } catch (error) {
      console.error('Error al actualizar el perfil', error);
      Swal.fire('Error', 'No se pudo actualizar el perfil.', 'error');
    }
  };

  const getRoleName = (roleId) => {
    const role = roles.find(role => role._id === roleId);
    return role ? role.name : 'Rol no encontrado';
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
          <h1 className="text-3xl font-bold mb-2">¡Bienvenido a Book Store USAC!</h1>
          <p className="text-lg">Aquí puedes ver y actualizar tu perfil.</p>
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mi Perfil</h2>
          {!editando ? (
            <div className="space-y-4">
              <p className="text-lg text-gray-700"><span className="font-semibold">Nombre:</span> {usuario.first_name}</p>
              <p className="text-lg text-gray-700"><span className="font-semibold">Apellido:</span> {usuario.last_name}</p>
              <p className="text-lg text-gray-700"><span className="font-semibold">Email:</span> {usuario.email}</p>
              <p className="text-lg text-gray-700"><span className="font-semibold">Teléfono:</span> {usuario.phone}</p>
              <p className="text-lg text-gray-700"><span className="font-semibold">Dirección:</span> {usuario.address}</p> {/* Agregado campo de dirección */}
              <p className="text-lg text-gray-700"><span className="font-semibold">Rol:</span> {getRoleName(usuario.rol)}</p>
              <button onClick={handleEdit} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300">Editar</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="first_name" value={usuario.first_name} onChange={handleChange} className="block w-full px-4 py-2 border rounded-md focus:border-blue-400 focus:ring focus:ring-blue-300" placeholder="Nombre" />
              <input name="last_name" value={usuario.last_name} onChange={handleChange} className="block w-full px-4 py-2 border rounded-md focus:border-blue-400 focus:ring focus:ring-blue-300" placeholder="Apellido" />
              <input name="email" value={usuario.email} onChange={handleChange} className="block w-full px-4 py-2 border rounded-md focus:border-blue-400 focus:ring focus:ring-blue-300" placeholder="Email" />
              <input name="phone" value={usuario.phone} onChange={handleChange} className="block w-full px-4 py-2 border rounded-md focus:border-blue-400 focus:ring focus:ring-blue-300" placeholder="Teléfono" />
              <input name="address" value={usuario.address} onChange={handleChange} className="block w-full px-4 py-2 border rounded-md focus:border-blue-400 focus:ring focus:ring-blue-300" placeholder="Dirección" /> {/* Agregado campo de dirección */}
              <div className="flex justify-between">
                <button type="button" onClick={handleEdit} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 transition duration-300">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition duration-300">Actualizar</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
