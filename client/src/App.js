// IMPORTED IDE
import React from 'react'
import Home from './routes/home'
import Register from './routes/register'
import Login from './routes/login'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

// ROUTE SYSTEM
function App() {

// ----- GAWA KA DITO NG IN SESSION 




  return (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/> 
      <Route path='/Register' element={<Register/>}/>
      <Route path='/Login' element={<Login/>}/>
    </Routes>
  </BrowserRouter>
  )
}

export default App