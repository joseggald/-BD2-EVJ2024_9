import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import React from 'react';
import './App.css';
import './index.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import MyProfile from './components/MyProfile'; 
import Authors from './components/Authors'; 
import AuthorDetails from './components/AuthorDetails';
import Books from './components/Books';
import BookDetails from './components/BookDetails';
import History from './components/History';
import Reports from './components/Reports';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Navigate to="mi-perfil" replace />} />
          <Route path="mi-perfil" element={<MyProfile />} />
          <Route path="autores" element={<Authors />} />
          <Route path="autores/:id" element={<AuthorDetails />} />
          <Route path="libros" element={<Books />} />
          <Route path="libros/:id" element={<BookDetails />} />
          <Route path="historial-compras" element={<History />} />
          <Route path="reportes" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;