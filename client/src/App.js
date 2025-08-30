// IMPORTED IDE
import Home from './routes/home'
import UserMain from './routes/users/main'
import AdminMain from './routes/admin/adminMain';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Schedule from './routes/users/schedule';
import Notes from './routes/users/notes';
import CreateTask from './routes/users/createtask';

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
      <Route path='/Schedule' element={<Schedule/>}/>
      <Route path='/Notes' element={<Notes/>}/>
      <Route path='/CreateTask' element={<CreateTask/>}/>
    </Routes>

  </BrowserRouter>
  )
}

export default App