import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux'; // Importar useDispatch
import { loginSuccess } from '../store/userActions'; // Asegúrate de importar la acción correcta
import Swal from 'sweetalert2';

const Login = () => {
     const [username, setUsername] = useState('');
     const [password, setPassword] = useState('');
     const navigate = useNavigate();
     const dispatch = useDispatch(); // Usar useDispatch
 
     const handleUsernameChange = (e) => setUsername(e.target.value);
     const handlePasswordChange = (e) => setPassword(e.target.value);
 
     const handleSubmit = async (e) => {
         e.preventDefault();
         try {
             const response = await axios.post('http://localhost:5000/login', {
                 email: username,
                 password: password,
             });
 
             const { userData, rol } = response.data;
             const userId = userData[0].id;
             dispatch(loginSuccess(userId, rol));
 
             Swal.fire({
                icon: 'success',
                title: 'Inicio de sesión exitoso',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                navigate(`/dashboard`);
            });
         } catch (error) {
             console.error('Error en el login:', error);
             Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error en el login: ' + error.message,
            });
         }
     };
 
     const handleRegister = () => {
         navigate('/registro');
     };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-400 p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white shadow-md rounded-lg p-8 space-y-6">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Iniciar Sesión</h2>
                <div className="space-y-2">
                    <label className="block text-gray-700" htmlFor="username">Email</label>
                    <input
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="username"
                        type="email"
                        value={username}
                        onChange={handleUsernameChange}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-gray-700" htmlFor="password">Contraseña</label>
                    <input
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="password"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
                        type="submit"
                    >
                        Iniciar sesión
                    </button>
                </div>
                <div className="text-center">
                    <button
                        className="text-blue-600 hover:underline mt-4"
                        type="button"
                        onClick={handleRegister}
                    >
                        Registrar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
