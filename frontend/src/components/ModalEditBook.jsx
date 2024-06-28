import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ModalEditBook = ({ closeModal, book, reloadBooks }) => {
  const [editedBook, setEditedBook] = useState({
    _id: book._id,
    title: book.title,
    author_uid: book.author._id,
    description: book.description,
    genre: book.genre,
    released_date: book.released_date.slice(0, 10), // Formato de fecha YYYY-MM-DD
    stock: book.stock,
    price: book.price,
    image_url: book.image_url
  });

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

  const handleChange = (e) => {
    setEditedBook({ ...editedBook, [e.target.name]: e.target.value });
  };

  const handleEditBook = async () => {
    try {
      await axios.put(`http://localhost:5000/updateBook/${editedBook._id}`, editedBook);
      Swal.fire({
        icon: 'success',
        title: '¡Libro actualizado!',
        text: 'El libro ha sido actualizado correctamente.',
      });
      reloadBooks(); // Recarga la lista de libros después de editar uno
      closeModal(); // Cierra el modal de edición
    } catch (error) {
      console.error('Error al actualizar el libro', error);
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Hubo un error al actualizar el libro. Por favor, intenta de nuevo.',
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">Editar Libro</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700">Título</label>
            <input
              type="text"
              name="title"
              className="w-full px-4 py-2 border rounded-md"
              onChange={handleChange}
              value={editedBook.title}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Autor</label>
            <select
              name="author_uid"
              className="w-full px-4 py-2 border rounded-md"
              onChange={handleChange}
              value={editedBook.author_uid}
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
              value={editedBook.description}
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Género</label>
            <input
              type="text"
              name="genre"
              className="w-full px-4 py-2 border rounded-md"
              onChange={handleChange}
              value={editedBook.genre}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Fecha de Lanzamiento</label>
            <input
              type="date"
              name="released_date"
              className="w-full px-4 py-2 border rounded-md"
              onChange={handleChange}
              value={editedBook.released_date}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Stock</label>
            <input
              type="number"
              name="stock"
              className="w-full px-4 py-2 border rounded-md"
              onChange={handleChange}
              value={editedBook.stock}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Precio</label>
            <input
              type="number"
              name="price"
              className="w-full px-4 py-2 border rounded-md"
              onChange={handleChange}
              value={editedBook.price}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">URL de la Imagen</label>
            <input
              type="text"
              name="image_url"
              className="w-full px-4 py-2 border rounded-md"
              onChange={handleChange}
              value={editedBook.image_url}
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
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            onClick={handleEditBook}
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditBook;
