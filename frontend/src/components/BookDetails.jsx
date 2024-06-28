import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userRole = useSelector((state) => state.user.role);
  const userId = useSelector((state) => state.user.userId);

  const [book, setBook] = useState(null);
  const [author, setAuthor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    content: '',
    rating: '',
  });
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [shoppingCartId, setShoppingCartId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchBookDetails();
    fetchUserDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      const response = await axios.post('http://localhost:5000/getBookById', { id });
      const { book, author, reviews } = response.data;
      setBook(book[0]);
      setAuthor(author[0]);
      setReviews(reviews);
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching book details', error);
      setErrorMessage('Error al cargar los detalles del libro. Por favor, inténtalo de nuevo más tarde.');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al cargar los detalles del libro. Por favor, inténtalo de nuevo más tarde.',
      });
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await axios.post('http://localhost:5000/getUserById', { id: userId });
      const user = response.data[0];
      setShoppingCartId(user.shopping_cart);
    } catch (error) {
      console.error('Error fetching user details', error);
      setErrorMessage('Error al cargar los detalles del usuario. Por favor, inténtalo de nuevo más tarde.');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al cargar los detalles del usuario. Por favor, inténtalo de nuevo más tarde.',
      });
    }
  };

  const handleAddReview = async () => {
    try {
      const response = await axios.post('http://localhost:5000/addReview', {
        idBook: id,
        idUser: userId,
        content: newReview.content,
        rating: parseFloat(newReview.rating),
      });
      setNewReview({ content: '', rating: '' });
      fetchBookDetails();
      setIsAddingReview(false);
      Swal.fire({
        icon: 'success',
        title: '¡Reseña añadida!',
        text: 'Gracias por tu opinión.',
      });
    } catch (error) {
      console.error('Error adding review', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al añadir la reseña. Por favor, inténtalo de nuevo más tarde.',
      });
    }
  };

  const toggleAddingReview = () => {
    setIsAddingReview(!isAddingReview);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    if (!shoppingCartId) {
      setErrorMessage('Debes tener un carrito de compras para añadir productos.');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes tener un carrito de compras para añadir productos.',
      });
      return;
    }

    if (book.stock === 0) {
      setErrorMessage('Este libro no está disponible en stock.');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Este libro no está disponible en stock.',
      });
      return;
    }

    try {
      await axios.post('http://localhost:5000/addProductToCart', {
        order_uid: shoppingCartId,
        book_uid: id,
        quantity,
      });
      Swal.fire({
        icon: 'success',
        title: '¡Añadido al carrito!',
        text: `Has añadido ${quantity} copia(s) de ${book.title} al carrito.`,
      });
      setTimeout(() => {
        window.location.reload(); 
      }, 2000);
      
    } catch (error) {
      console.error('Error adding product to cart', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al añadir el producto al carrito. Por favor, inténtalo de nuevo más tarde.',
      });
    }
  };

  if (!book || !author) return <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-6">Cargando...</div>;

  return (
    <div className="author-container max-w-7xl mx-auto bg-white shadow-lg rounded-lg">
      <div className="p-6">
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <div className="flex justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-4">{book.title}</h2>
            <p className="text-gray-700 mb-2">Género: {book.genre}</p>
            <p className="text-gray-700 mb-2">Autor: {author.first_name} {author.last_name}</p>
            <p className="text-gray-700 mb-2">Fecha de Lanzamiento: {format(new Date(book.released_date), 'dd/MM/yyyy')}</p>
            <p className="text-gray-600 mb-4">{book.description}</p>
            <p className="text-gray-700 mb-2">Precio: ${book.price}</p>
            <p className="text-gray-700 mb-2">Stock: {book.stock}</p>
            <p className="text-gray-700 mb-2">Rating: {book.rating}</p>
          </div>
          {userRole === 'Client' && (
            <div className="ml-4 flex items-center">
              <input
                type="number"
                className="border border-gray-300 rounded-lg p-2 w-16"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                max={book.stock}
              />
              <button
                onClick={handleAddToCart}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md ml-2"
              >
                Añadir al Carrito
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-4 mt-4">
          <h3 className="text-2xl font-bold mb-2">Reseñas</h3>
          {reviews.length === 0 ? (
            <p className="text-gray-700">Aún no hay reseñas para este libro.</p>
          ) : (
            <div>
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-200 py-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <p className="text-gray-600 mr-2">Usuario: {review.user_name} ({review.user_email})</p>
                      <p className="text-gray-600">Rating: {review.rating}</p>
                    </div>
                    <p className="text-gray-600">Fecha: {format(new Date(review.created_on), 'dd/MM/yyyy')}</p>
                    <button
                      onClick={() => Swal.fire({
                        title: `Reseña de ${review.user_name}`,
                        html: `
                          <p><strong>Rating:</strong> ${review.rating}</p>
                          <p><strong>Fecha:</strong> ${format(new Date(review.created_on), 'dd/MM/yyyy')}</p>
                          <p><strong>Contenido:</strong></br>${review.content}</p>
                        `,
                        confirmButtonText: 'Cerrar',
                      })}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1 rounded-md ml-2"
                    >
                      Ver Reseña
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {userRole === 'Client' && (
            <div className="mt-4">
              {!isAddingReview ? (
                <button
                  onClick={toggleAddingReview}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Dejar Reseña
                </button>
              ) : (
                <div className="mt-4">
                  <textarea
                    className="border border-gray-300 rounded-lg p-2 w-full mb-2"
                    placeholder="Escribe tu reseña aquí..."
                    value={newReview.content}
                    onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                  />
                  <input
                    type="text"
                    className="border border-gray-300 rounded-lg p-2 w-full mb-2"
                    placeholder="Rating (ej. 4.5)"
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleAddReview}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mr-2"
                    >
                      Enviar Reseña
                    </button>
                    <button
                      onClick={toggleAddingReview}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
