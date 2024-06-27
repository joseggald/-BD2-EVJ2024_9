import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ModalAddBook from './ModalAddBook';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import ModalEditBook from './ModalEditBook'; // Importamos el nuevo componente de modal de edición

const BooksView = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // Estado para mostrar el modal de edición
  const [selectedBook, setSelectedBook] = useState(null); // Estado para almacenar el libro seleccionado para editar
  const [newBook, setNewBook] = useState({
    title: '',
    author_uid: '',
    description: '',
    genre: '',
    released_date: '',
    stock: '',
    price: '',
    image_url: ''
  });

  const userRole = useSelector((state) => state.user.role);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/getAllBooks');
      setBooks(response.data);
    } catch (error) {
      console.error('Error al obtener los libros', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.post('http://localhost:5000/getBookByTitle', { title: searchTerm });
      setBooks(response.data);
    } catch (error) {
      console.error('Error al buscar libros por título', error);
    }
  };

  const handleClear = async () => {
    setSearchTerm('');
    try {
      const response = await axios.get('http://localhost:5000/getAllBooks');
      setBooks(response.data);
    } catch (error) {
      console.error('Error al obtener los libros', error);
    }
  };

  const handleChange = (e) => {
    setNewBook({ ...newBook, [e.target.name]: e.target.value });
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openEditModal = (book) => {
    setSelectedBook(book);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setSelectedBook(null);
    setShowEditModal(false);
  };

  const confirmDeleteBook = (bookId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará permanentemente el libro.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/deleteBook/${bookId}`);
          Swal.fire({
            icon: 'success',
            title: '¡Libro eliminado!',
            text: 'El libro ha sido eliminado correctamente.',
          });
          fetchBooks(); // Recarga la lista de libros después de eliminar uno
        } catch (error) {
          console.error('Error al eliminar el libro', error);
          Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'Hubo un error al eliminar el libro. Por favor, intenta de nuevo.',
          });
        }
      }
    });
  };

  return (
    <div className="author-container">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6">
          <h1 className="text-3xl font-bold mb-2">¡Bienvenido al Catálogo de Libros!</h1>
          <p className="text-lg">Aquí puedes ver y gestionar los libros.</p>
        </div>
        <div className="p-6">
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Buscar por título..."
              className="px-4 py-2 border rounded-md mr-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mr-2"
              onClick={handleSearch}
            >
              Buscar
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md mr-2"
              onClick={handleClear}
            >
              Limpiar
            </button>
            {userRole === 'Admin' && (
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md ml-auto"
                onClick={openModal}
              >
                Agregar Libro
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map((book, index) => (
              <div key={book._id} className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300">
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
                  <p className="text-gray-700 mb-2">Género: {book.genre}</p>
                  <p className="text-gray-700 mb-2">Autor: {book.author.first_name} {book.author.last_name}</p>
                  <p className="text-gray-700 mb-2">Precio: ${book.price}</p>
                  <p className="text-gray-600 mb-4">{book.description}</p>
                </div>
                <div className="flex justify-end px-4 pb-4">
                  {userRole === 'Admin' && (
                    <>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mr-2"
                        onClick={() => confirmDeleteBook(book._id)}
                      >
                        Eliminar
                      </button>
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md mr-2"
                        onClick={() => openEditModal(book)} // Abrir modal de edición con el libro seleccionado
                      >
                        Editar
                      </button>
                    </>
                  )}
                  <Link
                    to={`/dashboard/libros/${book._id}`}
                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal para agregar nuevo libro */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl p-8 mx-4 md:max-w-2xl md:p-0">
            <ModalAddBook
              closeModal={closeModal}
              handleChange={handleChange}
              newBook={newBook}
              reloadBooks={fetchBooks} // Pasa la función para recargar libros como prop
            />
          </div>
        </div>
      )}

      {/* Modal para editar libro */}
      {showEditModal && selectedBook && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl p-8 mx-4 md:max-w-2xl md:p-0">
            <ModalEditBook
              closeModal={closeEditModal}
              book={selectedBook}
              reloadBooks={fetchBooks} // Pasa la función para recargar libros como prop
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksView;
