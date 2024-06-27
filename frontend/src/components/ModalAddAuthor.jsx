import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2';

const Modal = ({ closeModal, handleChange, newAuthor, reloadAuthors }) => {
  const userRole = useSelector((state) => state.user.role);

  const handleAddAuthor = async () => {
    try {
      const authorData = {
        ...newAuthor,
        age: parseInt(newAuthor.age)
      };

      const response = await axios.post('http://localhost:5000/addAuthor', authorData);
      console.log('Autor agregado:', response.data);
      closeModal();
      reloadAuthors(); // Llama a la función para recargar los autores después de agregar uno nuevo
      Swal.fire({
        icon: 'success',
        title: '¡Autor agregado!',
        text: 'El autor ha sido agregado exitosamente.',
      });
    } catch (error) {
      console.error('Error al agregar el autor:', error);
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Hubo un error al agregar el autor. Por favor, intenta de nuevo.',
      });
    }
  };

  if (!userRole || userRole !== 'Admin') return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-lg max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Agregar Nuevo Autor</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={newAuthor.first_name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
              Apellido
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={newAuthor.last_name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">
              Edad
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={newAuthor.age}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="biography" className="block text-sm font-medium text-gray-700">
              Biografía
            </label>
            <textarea
              id="biography"
              name="biography"
              value={newAuthor.biography}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              onClick={closeModal}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={handleAddAuthor}
            >
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
