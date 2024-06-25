import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DeleteBook() {
  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getAllBooks');
        setBooks(response.data);
      } catch (error) {
        console.error('Error al obtener la lista de libros:', error);
      }
    };

    fetchBooks();
  }, []);

  const handleSelectChange = (e) => {
    setSelectedBookId(e.target.value);
  };

  const handleDelete = async () => {
    if (!selectedBookId) {
      alert('Selecciona un libro para eliminar.');
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:5000/deleteBook/${selectedBookId}`);
      console.log('Libro eliminado:', response.data);
      
      // Actualizar la lista de libros después de eliminar
      const updatedBooks = books.filter(book => book._id !== selectedBookId);
      setBooks(updatedBooks);
      setSelectedBookId('');
      
      alert('Libro eliminado correctamente.');
    } catch (error) {
      console.error('Error al eliminar el libro:', error);
      alert('Error al eliminar el libro. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="DeleteBook">
      <h2>Eliminar Libro</h2>
      <div>
        <label htmlFor="selectBook">Selecciona un libro:</label>
        <select id="selectBook" value={selectedBookId} onChange={handleSelectChange}>
          <option value="">Selecciona un libro</option>
          {books.map((book) => (
            <option key={book._id} value={book._id}>
              {book.title}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleDelete}>Eliminar Libro</button>
    </div>
  );
}

export default DeleteBook;
