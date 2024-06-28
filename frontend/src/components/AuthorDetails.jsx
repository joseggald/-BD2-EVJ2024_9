import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AuthorDetails = () => {
  const { id } = useParams(); // Obtener el authorId de los parámetros de la ruta
  const [author, setAuthor] = useState(null);
  const [books, setBooks] = useState([]);
  const [expandedBook, setExpandedBook] = useState(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await axios.post('http://localhost:5000/getAuthor', { author_uid: id });
        setAuthor(response.data[0]);
      } catch (error) {
        console.error('Error al obtener el autor', error);
      }
    };

    const fetchBooks = async () => {
      try {
        const response = await axios.post('http://localhost:5000/getBooksAuthor', { authorId: id });
        console.log('Libros del autor:', response.data)
        setBooks(response.data);
      } catch (error) {
        console.error('Error al obtener los libros del autor', error);
      }
    };

    fetchAuthor();
    fetchBooks();
  }, [id]);

  const toggleBookDetails = (bookId) => {
    setExpandedBook(expandedBook === bookId ? null : bookId);
  };

  if (!author) {
    return <div>Cargando detalles del autor...</div>;
  }

  return (
    <div className="author-container px-4 py-6">
      <h2 className="text-3xl font-semibold mb-4">{author.first_name} {author.last_name}</h2>
      <p className="text-gray-700 mb-2">Edad: {author.age}</p>
      <p className="text-gray-600 mb-6">{author.biography}</p>

      <h3 className="text-2xl font-semibold mb-4">Libros</h3>
      {books.length === 0 ? (
        <p className="text-gray-600">Este autor no tiene libros.</p>
      ) : (
        <div className="space-y-4">
          {books.map((book) => (
            <div key={book._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-4 flex justify-between items-center">
                <h4 className="text-xl font-semibold">{book.title}</h4>
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => toggleBookDetails(book._id)}
                >
                  {expandedBook === book._id ? 'Ocultar detalles' : 'Ver detalles'}
                </button>
              </div>
              {expandedBook === book._id && (
                <div className="p-4 border-t">
                  <p className="text-gray-700"><strong>Género:</strong> {book.genre}</p>
                  <p className="text-gray-700"><strong>Fecha de lanzamiento:</strong> {new Date(book.released_date).toLocaleDateString()}</p>
                  <p className="text-gray-700"><strong>Disponibilidad:</strong> {book.available ? 'Disponible' : 'No disponible'}</p>
                  <p className="text-gray-700"><strong>Stock:</strong> {book.stock}</p>
                  <p className="text-gray-700"><strong>Precio:</strong> ${book.price.toFixed(2)}</p>
                  <p className="text-gray-700"><strong>Descripción:</strong> {book.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuthorDetails;
