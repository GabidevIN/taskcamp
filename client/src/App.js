// IMPORTED IDE
import Home from './routes/home'
import UserMain from './routes/users/main'
import AdminMain from './routes/admin/adminMain';
import {BrowserRouter, Routes, Route} from 'react-router-dom'

// ROUTE SYSTEM
function App() {

  return (
  <BrowserRouter>

    {/* APPLICATION ROUTES */}
    <Routes>
      <Route path='/' element={<Home/>}/> 

    </Routes>

    {/* ADMIN ROUTES */}
     <Routes>
      <Route path='/admin/adminMain'element={<AdminMain/>}/>
    </Routes>

    {/* USER ROUTES */}
     <Routes>
      <Route path='/Main' element={<UserMain/>}/>
    </Routes>

  </BrowserRouter>
  )
}

export default App