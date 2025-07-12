import { useState, useEffect } from 'react';
import Register from './register'
import LOGIN from './login'
import { Link } from 'react-router-dom';



function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showReg, setShowReg] = useState(false);

const handleAuthClick = (type) => (e) => {
  e.preventDefault();
  setShowLogin(type === "login");
  setShowReg(type === "register");
};

const closebtn = () => {
  setShowLogin(false);
  setShowReg(false);
};





return (
  <>
  <title>TASKCAMP</title>
    <div className="w-screen h-screen bg-gradient-to-r from-[#948997] to-[#393e3e] text-white p-4 rounded">
      <nav className='flex justify-center gap-4'>
        <a href="#" className='text-black bg-white rounded-e-md border border-black p-2' onClick={handleAuthClick("login") }>Login</a>
        <a href="#" className='text-black bg-white rounded-e-md border border-black p-2' onClick={handleAuthClick("register")}>Register</a>
      </nav>

      <h1 className='font-bold text-center'>ON PROGRESS</h1>
      <div className='flex justify-center gap-4'>
        <Link to="/Register" className='text-black bg-white'>Register</Link>
        <Link to="/Login" className='text-black bg-white '>LOGIN</Link>
      </div>

{/*----- LOGIN FORM // HIDDEN -----*/}
{showLogin && (
  <div className='bg-white text-black p-4 rounded w-fit max-w-md mx-auto my-4'>
    <div>
      <h2>LOGIN</h2>
        <form>
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <button type="submit">Login</button>
        </form>
      <button onClick={closebtn}>Close</button>
    </div>
  </div>      
)}

{/*----- REGISTRATION FORM // HIDDEN -----*/}
{showReg && (
  <div className='bg-white text-black p-4 rounded w-fit max-w-md mx-auto my-4'>
    <div>
      <h2>REGIS</h2>
        <form>
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <button type="submit">Login</button>
        </form>
      <button onClick={closebtn}>Close</button>
    </div>
  </div>
)}
      </div>
    </>
  )
}

export default Home