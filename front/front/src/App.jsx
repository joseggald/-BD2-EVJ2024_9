import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'
import Registro from './components/Registro'
import Login from './components/Login'
import AddBook from './components/AddBook'
import UpdateBook from './components/UpdateBook'
import UserProfile from './components/Profiel'
import OrdersPage from './components/HistorialPedidosUser'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
    <Routes> 

     
      <Route path='/Registro' element={<Registro />}></Route>
      <Route path='/Login' element={<Login />}></Route>
      <Route path='/AddBook' element={<AddBook />}></Route>
      <Route path='/UpdateBook' element={<UpdateBook />}></Route>
      
      <Route path='/UserProfile' element={<UserProfile />}></Route>
      <Route path='/OrdersPage' element={<OrdersPage />}></Route>
    </Routes>
    
    </BrowserRouter>
    </>
  )
}

export default App
