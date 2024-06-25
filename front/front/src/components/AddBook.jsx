import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddBook() {
  const [formData, setFormData] = useState({
    title: '',
    author_uid: '',
    description: '',
    genre: '',
    released_date: '',
    stock: 0,
    price: 0,
    image_url: '',
  });

  const [authors, setAuthors] = useState([]);
  const [selectedAuthorFirstName, setSelectedAuthorFirstName] = useState('');

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getAllAuthors');
        setAuthors(response.data);
      } catch (error) {
        console.error('Error al obtener la lista de autores:', error);
      }
    };

    fetchAuthors();
  }, []);

  const handleSelectChange = async (e) => {
    const authorId = e.target.value;
    const author = authors.find((author) => author._id === authorId);
    if (author) {
      setSelectedAuthorFirstName(author.first_name);
      try {
        const response = await axios.get(`http://localhost:5000/getAuthorName/${authorId}`);
        const firstName = response.data.first_name;
        setFormData({
          ...formData,
          author_uid: authorId,
        });
      } catch (error) {
        console.error('Error al obtener el nombre del autor:', error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/addBook', formData);
      console.log('Response:', response.data);
      
    } catch (error) {
      console.error('Error:', error);
      
    }
  };

  return (
    <div className="AddBook">
      <h2>Agregar Libro</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Título:</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="author_uid">Autor:</label>
          <select id="author_uid" name="author_uid" value={formData.author_uid} onChange={handleSelectChange} required>
            <option value="">Selecciona un autor</option>
            {authors.map((author) => (
              <option key={author._id} value={author._id}>
                {author.first_name} {author.last_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="description">Descripción:</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="genre">Género:</label>
          <input type="text" id="genre" name="genre" value={formData.genre} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="released_date">Fecha de Lanzamiento:</label>
          <input
            type="date"
            id="released_date"
            name="released_date"
            value={formData.released_date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="stock">Stock:</label>
          <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="price">Precio:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>
        <div>
          <label htmlFor="image_url">URL de la Imagen:</label>
          <input type="url" id="image_url" name="image_url" value={formData.image_url} onChange={handleChange} required />
        </div>
        <button type="submit">Agregar Libro</button>
      </form>
    </div>
  );
}

export default AddBook;
