import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const Register = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        rol: ''
    });

    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get('http://localhost:5000/getRoles');
                setRoles(response.data);
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };
        fetchRoles();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/register', formData);
            Swal.fire({
                icon: 'success',
                title: 'Registro exitoso',
                text: 'Ahora serás redirigido a la página de inicio de sesión.',
                showConfirmButton: false,
                timer: 2500
            }).then(() => {
                navigate('/login');
            });
        } catch (error) {
            console.error('Error en el registro:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error en el registro: ' + error.message,
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-300 p-2">
            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white shadow-md rounded-lg p-6 space-y-4">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Registro</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label className="block text-gray-700" htmlFor="first_name">Nombre</label>
                        <input
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="first_name"
                            name="first_name"
                            type="text"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-gray-700" htmlFor="last_name">Apellido</label>
                        <input
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="last_name"
                            name="last_name"
                            type="text"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label className="block text-gray-700" htmlFor="email">Email</label>
                        <input
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-gray-700" htmlFor="phone">Teléfono</label>
                        <input
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="phone"
                            name="phone"
                            type="text"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="block text-gray-700" htmlFor="address">Dirección</label>
                    <input
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="address"
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-gray-700" htmlFor="password">Contraseña</label>
                    <input
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-gray-700" htmlFor="rol">Rol</label>
                    <select
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="rol"
                        name="rol"
                        value={formData.rol}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione un rol</option>
                        {roles.map((role) => (
                            <option key={role._id} value={role._id}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-200"
                        type="submit"
                    >
                        Registrar
                    </button>
                </div>
                <div className="text-center">
                    <button
                        className="text-blue-600 hover:underline mt-4"
                        type="button"
                        onClick={() => navigate('/login')}
                    >
                        Iniciar Sesión
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Register;
