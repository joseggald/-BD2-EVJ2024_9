import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'
import Registro from './components/Registro'
import Login from './components/Login'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
    <Routes> 

     
      <Route path='/Registro' element={<Registro />}></Route>
      <Route path='/Login' element={<Login />}></Route>
      
    </Routes>
    
    </BrowserRouter>
    </>
  )
}

export default App
