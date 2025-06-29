// IMPORTED IDE
import React from 'react'
import Login from './routes/login'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

// ROUTE SYSTEM
function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login/>}/> 
    </Routes>
  </BrowserRouter>
  )
}

export default App