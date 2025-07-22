// IMPORTED IDE
import React from 'react'
import Home from './routes/home'
import Register from './routes/register'
import UserMain from './routes/users/main'
import Login from './routes/login'
import AdminMain from './routes/admin/adminMain';
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
      <Route path='/Main' element={<UserMain/>}/>
    </Routes>


     <Routes>
      <Route path='/admin/adminMain'element={<AdminMain/>}/>
    </Routes>
  </BrowserRouter>

  
  )
}

export default App