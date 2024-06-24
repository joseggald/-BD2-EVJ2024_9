import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'
import Registro from './components/Registro'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
    <Routes> 

     
      <Route path='/Registro' element={<Registro />}></Route>
      
    </Routes>
    
    </BrowserRouter>
    </>
  )
}

export default App
