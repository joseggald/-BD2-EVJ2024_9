import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      const response = await axios.post('http://localhost:5000/getBookById', { id });
      setBook(response.data.book[0]);
      setAuthor(response.data.author[0]);
    } catch (error) {
      console.error('Error al obtener los detalles del libro', error);
    }
  };

  if (!book || !author) return <div>Cargando...</div>;

  return (
    <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-4">{book.title}</h2>
        <p className="text-gray-700 mb-2">Género: {book.genre}</p>
        <p className="text-gray-700 mb-2">Autor: {author.first_name} {author.last_name}</p>
        <p className="text-gray-700 mb-2">Fecha de Lanzamiento: {new Date(book.released_date).toLocaleDateString()}</p>
        <p className="text-gray-600 mb-4">{book.description}</p>
        <p className="text-gray-700 mb-2">Precio: ${book.price}</p>
        <p className="text-gray-700 mb-2">Stock: {book.stock}</p>
        <div className="flex justify-end mt-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">Comprar</button>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
