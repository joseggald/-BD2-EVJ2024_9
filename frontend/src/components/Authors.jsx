import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Modal from './ModalAddAuthor';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

const AuthorsView = () => {
  const [autores, setAutores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newAuthor, setNewAuthor] = useState({
    first_name: '',
    last_name: '',
    biography: '',
    age: ''
  });

  const userRole = useSelector((state) => state.user.role);

  useEffect(() => {
    fetchAutores();
  }, []);

  const fetchAutores = async () => {
    try {
      const response = await axios.get('http://localhost:5000/getAllAuthors');
      setAutores(response.data);
    } catch (error) {
      console.error('Error al obtener los autores', error);
    }
  };

  const toggleBioVisibility = (index) => {
    const updatedAutores = autores.map((autor, i) =>
      i === index ? { ...autor, expanded: !autor.expanded } : autor
    );
    setAutores(updatedAutores);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.post('http://localhost:5000/getAuthorName', { name: searchTerm });
      setAutores(response.data);
    } catch (error) {
      console.error('Error al buscar autores por nombre', error);
    }
  };

  const handleClear = async () => {
    setSearchTerm('');
    try {
      const response = await axios.get('http://localhost:5000/getAllAuthors');
      setAutores(response.data);
    } catch (error) {
      console.error('Error al obtener los autores', error);
    }
  };

  const handleChange = (e) => {
    setNewAuthor({ ...newAuthor, [e.target.name]: e.target.value });
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const confirmDeleteAuthor = (authorId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará permanentemente al autor.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete('http://localhost:5000/deleteAuthor', { data: { authorId } });
          Swal.fire({
            icon: 'success',
            title: '¡Autor eliminado!',
            text: 'El autor ha sido eliminado correctamente.',
          });
          fetchAutores(); // Recarga la lista de autores después de eliminar uno
        } catch (error) {
          console.error('Error al eliminar el autor', error);
          Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'Hubo un error al eliminar el autor. Por favor, intenta de nuevo.',
          });
        }
      }
    });
  };

  return (
    <div className="author-container">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6">
          <h1 className="text-3xl font-bold mb-2">¡Bienvenido al Catálogo de Autores!</h1>
          <p className="text-lg">Aquí puedes ver y gestionar los autores.</p>
        </div>
        <div className="p-6">
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Buscar por nombre..."
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
                Agregar Autor
              </button>
            )}
          </div>
          <div className='cards-container'>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto ">
            {autores.map((autor, index) => (
              <div key={autor._id} className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{autor.first_name} {autor.last_name}</h3>
                  <p className="text-gray-700 mb-4">Edad: {autor.age}</p>
                  <div className={`${autor.expanded ? '' : 'h-20 overflow-hidden'}`}>
                    <p className="text-gray-600">{autor.biography}</p>
                  </div>
                  <div className="flex justify-end mt-4">
                    {userRole === 'Admin' && (
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mr-2"
                        onClick={() => confirmDeleteAuthor(autor._id)}
                      >
                        Eliminar
                      </button>
                    )}
                    <Link
                      to={`/dashboard/autores/${autor._id}`}
                      className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md mr-2"
                    >
                      Ver detalles
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>

      {showModal && (
        <Modal
          closeModal={closeModal}
          handleChange={handleChange}
          newAuthor={newAuthor}
          reloadAuthors={fetchAutores} // Pasa la función para recargar autores como prop
        />
      )}
    </div>
  );
};

export default AuthorsView;
