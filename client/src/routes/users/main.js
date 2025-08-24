import {useState, useEffect} from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { menu } from 'framer-motion/client';


function Main() {
// ----- SESSION SYSTEM
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState(false);


  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:8081')
    .then(res => {
      console.log(res.data);
      if (res.data.Status === "Success") {
        setName(res.data.name);
        setStatus(res.data.admin);

        if (Number(res.data.admin) === 1) {
          setMessage('You are logged in as an Admin');
          setAuth(false);
        } else {
          setAuth(true);
        } 
        
      } else {
        setAuth(false);
        setMessage(res.data.Error);
      }
    })
  .then(err => console.log(err));
  }, [])


  const logout = () => {
    axios.get('http://localhost:8081/logout')
    .then(res => {
      window.location.reload(true);
    }).catch(err => console.log(err));
  }

// ----- System displays





// ----- function button
  const [Menu, OpenMenu] = useState(false);

return (
  <>   
    <div className="bg-[#BCA88D] h-screen w-screen">
    <title>MAIN</title>
    {    
      auth ?
      <>
      {Menu && (
        <div
          onClick={() => OpenMenu(false)}
          className="fixed inset-0 bg-black bg-opacity-0 z-100"
        ></div>
      )}

{/* NAV */}
      <div className={`fixed top-0 left-0 bg-gray-700 text-white p-5 transform transition-all duration-300 z-30 gap-5
        ${Menu ?  "translate-y-0 lg:translate-x-0 lg:translate-y-0 lg:bg-opacity-100 bg-opacity-75" 
                  : 
                  "-translate-y-full lg:-translate-x-full lg:translate-y-0 bg-opacity-0"}
        h-full w-full items-center justify-center flex flex-col

        lg:h-full lg:w-[25rem]`}>

        <h2 className="text-xl font-bold mb-5">Menu</h2>
          <ul className="space-y-4 items-center justify-center flex flex-col gap-1">
            <Link to="/Schedule" className="bg-[#BCA88D] text-center w-[10rem] p-2 rounded hover:bg-[#3E3F29] transition">
            SCHEDULE</Link>
            
            <Link to="/Notes" className="bg-[#BCA88D] text-center w-[10rem] p-2 rounded hover:bg-[#3E3F29] transition">
            NOTE</Link>

            <Link to="/Profile" className="bg-[#BCA88D] text-center w-[10rem] p-2 rounded hover:bg-[#3E3F29] transition">
            PROFILE</Link>

            <Link to="/Createtask" className="bg-[#BCA88D] text-center w-[10rem] p-2 rounded hover:bg-[#3E3F29] transition">
            CREATE TASK</Link>

            <button className="bg-[#BCA88D] text-center w-[10rem] p-2 rounded" onClick={() => OpenMenu(!Menu)} >{Menu ? "CLOSE" : "OPEN"}</button>
            
            <Link to="/" onClick={logout} className="bg-red-400 text-center w-[10rem] p-2 text-white rounded hover:bg-green-400 transition">
            LOGOUT</Link>
          </ul>
      </div>


{/*----- WELCOME SECTION -----*/}
        <div className="w-screen bg-[#3E3F29] h-14 z-5 fixed flex justify-start pl-[23rem] items-center shadow-md gap-4">
        <button onClick={() => OpenMenu(!Menu)} className="text-[#BCA88D] text-lg font-bold sm:mx-0 mx-auto cursor-pointer">img </button>
        </div>

{/*----- HERO SECTION -----*/}

<h3 className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl z-10">
  Welcome, {name}!
</h3>







      </>

        /* USER IS NOT AUTHENTICATED*/
        :
      <>
        <h3>{message}</h3>
        <h3>Login Now</h3>
        <Link to = "/" className="block text-center bg-green-600 text-white px-6 py-2 w-full rounded-none hover:bg-green-700">LOGIN</Link>
      </>
    }
    </div>
  </>
  )
}

export default Main