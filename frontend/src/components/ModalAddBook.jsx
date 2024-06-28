import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ModalAddBook = ({ closeModal, handleChange, newBook, reloadBooks }) => {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/getAllAuthors');
      setAuthors(response.data);
    } catch (error) {
      console.error('Error al obtener los autores', error);
    }
  };

  const handleAddBook = async () => {
    // Validar campos obligatorios
    if (!validateFields()) {
      return;
    }

    try {
      await axios.post('http://localhost:5000/addBook', newBook);
      Swal.fire({
        icon: 'success',
        title: '¡Libro Guardado!',
        text: 'El libro ha sido guardado correctamente.',
      });
      reloadBooks();
      closeModal();
    } catch (error) {
      console.error('Error al agregar el libro', error);
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Hubo un error al guardar el libro. Por favor, intenta de nuevo.',
      });
    }
  };

  const validateFields = () => {
    // Validar que todos los campos obligatorios estén completos
    const requiredFields = ['title', 'author_uid', 'description', 'genre', 'released_date', 'stock', 'price', 'image_url'];

    for (let field of requiredFields) {
      if (!newBook[field]) {
        Swal.fire({
          icon: 'error',
          title: '¡Campo Obligatorio!',
          text: `El campo "${field}" es obligatorio.`,
        });
        return false;
      }
    }

    return true;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">Agregar Libro</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700">Título</label>
            <input
              type="text"
              name="title"
              className="w-full px-4 py-2 border rounded-md"
              onChange={handleChange}
              value={newBook.title}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Autor</label>
            <select
              name="author_uid"
              className="w-full px-4 py-2 border rounded-md"
              onChange={handleChange}
              value={newBook.author_uid}
            >
              <option value="">Selecciona un autor</option>
              {authors.map((author) => (
                <option key={author._id} value={author._id}>
                  {author.first_name} {author.last_name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4 col-span-2">
            <label className="block text-gray-700">Descripción</label>
            <textarea
              name="description"
              className="w-full px-4 py-2 border rounded-md"
              onChange={handleChange}
              value={newBook.description}
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Género</label>
            <input
              type="text"
              name="genre"
              className="w-full px-4 py-2 border rounded-md"
              onChange={handleChange}
              value={newBook.genre}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Fecha de Lanzamiento</label>
            <input
              type="date"
              name="released_date"
              className="w-full px-4 py-2 border rounded-md"
              onChange={handleChange}
              value={newBook.released_date}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Stock</label>
            <input
              type="number"
              name="stock"
              className="w-full px-4 py-2 border rounded-md"
              onChange={handleChange}
              value={newBook.stock}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Precio</label>
            <input
              type="number"
              name="price"
              className="w-full px-4 py-2 border rounded-md"
              onChange={handleChange}
              value={newBook.price}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">URL de la Imagen</label>
            <input
              type="text"
              name="image_url"
              className="w-full px-4 py-2 border rounded-md"
              onChange={handleChange}
              value={newBook.image_url}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md mr-2"
            onClick={closeModal}
          >
            Cancelar
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
            onClick={handleAddBook}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAddBook;
