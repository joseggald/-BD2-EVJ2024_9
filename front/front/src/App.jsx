// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import Registro from './components/Registro';
import Login from './components/Login';
import AddBook from './components/AddBook';
import UpdateBook from './components/UpdateBook';
import UserProfile from './components/Profiel';
import OrdersPage from './components/HistorialPedidosUser';
import DeleteBook from './components/DeleteBook';
import SidebarLayout from './components/SidebarLayout';
import Authors from './components/autor/Autor';
import OrdersPageAdmin from './components/HistorialPedidosAdmin';
import MenuAdmin from './components/MenuAdmin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/Registro' element={<Registro />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/AddBook' element={
          <SidebarLayout>
            <AddBook />
          </SidebarLayout>
        } />
        <Route path='/UpdateBook' element={
          <SidebarLayout>
            <UpdateBook />
          </SidebarLayout>
        } />
        <Route path='/DeleteBook' element={
          <SidebarLayout>
            <DeleteBook />
          </SidebarLayout>
        } />
        <Route path='/UserProfile' element={
          <SidebarLayout>
            <UserProfile />
          </SidebarLayout>
        } />
        <Route path='/OrdersPage' element={
          <SidebarLayout>
            <OrdersPage />
          </SidebarLayout>
        } />
        <Route path='/OrdersPageAdmin' element={
          <SidebarLayout>
            <OrdersPageAdmin />
          </SidebarLayout>
        } />
        <Route path='/MenuAdmin' element={
          <SidebarLayout>
            <MenuAdmin />
          </SidebarLayout>
        } />

        <Route path='/Authors' element={
          <SidebarLayout>
            <Authors />
          </SidebarLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
