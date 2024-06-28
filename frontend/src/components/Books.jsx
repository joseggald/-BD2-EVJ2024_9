import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import ModalAddBook from './ModalAddBook';
import ModalEditBook from './ModalEditBook';
import { set } from 'date-fns';

const BooksView = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
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
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar la carga
  const [sortBy, setSortBy] = useState('');
  const [oneTime, setOneTime] = useState(false);
  
  

  const userRole = useSelector((state) => state.user.role);
  useEffect(() => {
    fetchBooks();
    fetchGenres();
  }, []);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/getAllBooks');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await axios.get('http://localhost:5000/getAllGenres');
      setGenres(response.data);
    } catch (error) {
      console.error('Error fetching genres', error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:5000/getBooksName', { name: searchTerm });
      setBooks(response.data);
    } catch (error) {
      console.error('Error searching books by title', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    setSearchTerm('');
    setSortBy('');
    setSelectedGenre('all');
    fetchBooks();
    setOneTime(false);
  };

  const handleGenreFilter = async (genre) => {
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:5000/getGenreBooks', { genre });
      setBooks(response.data);
    } catch (error) {
      console.error('Error filtering books by genre', error);
    } finally {
      setIsLoading(false);
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
          setIsLoading(true);
          await axios.delete(`http://localhost:5000/deleteBook/${bookId}`);
          setIsLoading(false);
          Swal.fire({
            icon: 'success',
            title: '¡Libro eliminado!',
            text: 'El libro se ha eliminado correctamente.',
          });
          fetchBooks();
        } catch (error) {
          console.error('Error deleting book', error);
          Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'Hubo un error al eliminar el libro. Por favor, inténtalo de nuevo.',
          });
        }
      }
    });
  };

  const handleGenreChange = (e) => {
    const genre = e.target.value;
    setSelectedGenre(genre);
    setIsLoading(true);
    if (genre === 'all') {
      fetchBooks();
    } else {
      handleGenreFilter(genre);
    }
    setIsLoading(false);
  };

  const handlePriceFilter = async (type) => {
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:5000/getBooksByPrice', { type });
      setBooks(response.data);
    } catch (error) {
      console.error('Error filtering books by price', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRatingFilter = async (type) => {
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:5000/getBooksByRating', { type });
      setBooks(response.data);
    } catch (error) {
      console.error('Error filtering books by rating', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortByRating = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/getHighRatingBooks');
      setBooks(response.data);
    } catch (error) {
      console.error('Error sorting books by rating', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortByRatingLow = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/getLowRatingBooks');
      setBooks(response.data);
    } catch (error) {
      console.error('Error sorting books by rating', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortByPricesLow = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/getLowPrices');
      setBooks(response.data);
    } catch (error) {
      console.error('Error sorting books by rating', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortByPricesHigh = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/getHighPrices');
      setBooks(response.data);
    } catch (error) {
      console.error('Error sorting books by rating', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortChange = (e) => {
    const sortBy = e.target.value;
    setSortBy(sortBy);
    setIsLoading(true);
    switch (sortBy) {
      case 'rating-high':
        handleSortByRating();
        break;
      case 'rating-low':
        handleSortByRatingLow();
        break;
      case 'prices-high':
        handleSortByPricesHigh();
        break;
      case 'prices-low':
        handleSortByPricesLow();
        break;
      default:
        fetchBooks(); // Cargar todos los libros si no hay opción seleccionada
        break;
    }
    setIsLoading(false);
  };
  const renderAllBooks = () => {
    if (books.length === 0) {
      return (
        <div className="text-center mt-8">
          <p className="text-xl">No se encontraron libros.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <div key={book._id} className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300">
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
              <p className="text-gray-700 mb-2">Género: {book.genre}</p>
              <p className="text-gray-700 mb-2">Autor: {book.author.first_name} {book.author.last_name}</p>
              <p className="text-gray-700 mb-2">Precio: ${book.price}</p>
              <p className="text-gray-600 mb-4">Rating: {book.rating}</p>
              <p className="text-gray-600 mb-4">{book.description}</p>
            </div>
            <div className="flex justify-end px-4 pb-4">
              {userRole === 'Admin' && (
                <>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mr-2"
                    onClick={() => confirmDeleteBook(book._id)}
                    disabled={isLoading} // Deshabilitar durante carga
                  >
                    Eliminar
                  </button>
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md mr-2"
                    onClick={() => openEditModal(book)}
                    disabled={isLoading} // Deshabilitar durante carga
                  >
                    Editar
                  </button>
                </>
              )}
              <Link
                to={`/dashboard/libros/${book._id}`}
                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Ver Detalles
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  };
  // Renderizar libros por género
  const renderBooksByGenre = (genre) => {

    const filteredBooks = books.filter(book => book.genre === genre);
    if (filteredBooks.length === 0) {
      return null; // No renderizar si no hay libros en este género
    }
    return (
      <div key={genre} className="mt-8">
        <h2 className="text-2xl font-bold mb-4">{genre}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBooks.map((book) => (
            <div key={book._id} className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300">
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
                <p className="text-gray-700 mb-2">Género: {book.genre}</p>
                <p className="text-gray-700 mb-2">Autor: {book.author.first_name} {book.author.last_name}</p>
                <p className="text-gray-700 mb-2">Precio: ${book.price}</p>
                <p className="text-gray-600 mb-4">Rating: {book.rating}</p>
                <p className="text-gray-600 mb-4">{book.description}</p>
              </div>
              <div className="flex justify-end px-4 pb-4">
                {userRole === 'Admin' && (
                  <>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mr-2"
                      onClick={() => confirmDeleteBook(book._id)}
                      disabled={isLoading} // Deshabilitar durante carga
                    >
                      Eliminar
                    </button>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md mr-2"
                      onClick={() => openEditModal(book)}
                      disabled={isLoading} // Deshabilitar durante carga
                    >
                      Editar
                    </button>
                  </>
                )}
                <Link
                  to={`/dashboard/libros/${book._id}`}
                  className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Ver Detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="author-container">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6">
          <h1 className="text-3xl font-bold mb-2">¡Bienvenido al Catálogo de Libros!</h1>
          <p className="text-lg">Aquí puedes ver y gestionar libros.</p>
        </div>
        <div className="p-6">
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Buscar por título..."
              className="px-4 py-2 border rounded-md mr-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading} // Deshabilitar durante carga
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mr-4"
              onClick={handleSearch}
              disabled={isLoading} // Deshabilitar durante carga
            >
              Buscar
            </button>
            <button
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md mr-4"
              onClick={handleClear}
              disabled={isLoading} // Deshabilitar durante carga
            >
              Limpiar
            </button>
            <select
              className="px-4 py-2 border rounded-md mr-4"
              value={selectedGenre}
              onChange={handleGenreChange}
              disabled={isLoading} // Deshabilitar durante carga
            >
              <option value="all">Todos los Géneros</option>
              {genres.map((genre, index) => (
                <option key={index} value={genre.genre}>{genre.genre}</option>
              ))}
            </select>
            <select
              className="px-4 py-2 border rounded-md mr-4"
              onChange={handleSortChange}
              value={sortBy}
              disabled={isLoading} // Deshabilitar durante carga
            >
              <option value="">Ordenar por</option>
              <option value="rating-high">Mejor Valorados</option>
              <option value="rating-low">Peor Valorados</option>
              <option value="prices-high">Precios más altos</option>
              <option value="prices-low">Precios más bajos</option>
            </select>
            {userRole === 'Admin' && (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md ml-auto"
                onClick={openModal}
                disabled={isLoading}
              >
                Agregar Libro
              </button>
            )}
          </div>
          {selectedGenre === 'all' && sortBy === '' ? (
            genres.map((genre, index) => renderBooksByGenre(genre.genre))
          ) : (
            selectedGenre === 'all' && sortBy.length > 1 ? renderAllBooks() : renderBooksByGenre(selectedGenre)
          )}

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
              reloadBooks={fetchBooks}
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
              reloadBooks={fetchBooks}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksView;
