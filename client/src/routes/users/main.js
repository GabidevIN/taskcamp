import {useState, useEffect} from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { menu } from 'framer-motion/client';


function Main() {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState(false);
  const [delay, setDelay] = useState('');
  const [completed, setCompleted] = useState('');
  const [late, setlate] = useState('');
  const [shared, setShared] = useState('');
  const [id, setId] = useState('');
  const [created, setCreated] = useState('');

// ----- SESSION SYSTEM

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:8081')
    .then(res => {
      console.log(res.data);
      if (res.data.Status === "Success") {
        setName(res.data.name);
        setStatus(res.data.admin);
        setDelay(res.data.delay);
        setCompleted(res.data.completed);
        setlate(res.data.late);
        setShared(res.data.shared);
        setId(res.data.id);
        setCreated(res.data.created);

        if (Number(res.data.admin) === 1) {
          setMessage('You are logged in as an Admin');
          setAuth(false);
        } else {
          setAuth(true);
        }
      } else {
        setAuth(false);
        setMessage(res.data.Error || 'Session expired, please log in.');
      }
    })
    .catch(() => {
      setAuth(false);
      setMessage('Failed to verify session. Please log in.');
    });
}, []);


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
    <div>
    <title>MAIN</title>
    {    
      auth ?
      <>
{/*----- NAVBAR -----*/}
        <div className='flex justify-center items-center m-10 '>
          <div className="w-[100px] outline outline-[0.5px] shadow-2xl lg:w-[1000px] md:w-[725px] bg-[#3E3F29] h-12 rounded-2xl z-5 fixed flex justify-center items-center shadow-md 
          gap-[100px] md:gap-[50px] my-2 text-base">

              <Link to="/" onClick={logout} className="bg-[#743636] px-4 py-1 rounded-2xl hover:bg-green-700 outline outline-[0.5px]
              block lg:block md:block sm:hidden">LOGOUT</Link>
              <Link to="/Schedule" className="bg-[#BCA88D] px-4 py-1 rounded-2xl hover:bg-green-700 outline outline-[0.5px]
              block lg:block md:block sm:hidden">SCHEDULE</Link>
              <Link to="/Main" className="bg-[#BCA88D] px-6 py-1 rounded-2xl hover:bg-green-700 outline outline-[0.5px]
              block lg:block md:block sm:hidden">MAIN</Link>
              <Link to="/Notes" className="bg-[#BCA88D] px-4 py-1 rounded-2xl hover:bg-green-700 outline outline-[0.5px]
              block lg:block md:block sm:hidden">NOTE</Link>
              <Link to="/Createtask" className="bg-[#BCA88D] px-4 py-1 rounded-2xl hover:bg-green-700 outline outline-[0.5px] block 
              block lg:block md:block sm:hidden">TASK</Link>
            
            <button onClick={() => OpenMenu(!Menu)} className="text-[#BCA88D] block lg:hidden md:hidden text-lg  cursor-pointer">MENU </button>
          </div>
        </div>

      {Menu && (
        <div
          onClick={() => OpenMenu(false)}
          className="fixed inset-0 bg-black bg-opacity-0 z-100"
        ></div>
      )}
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

{/*----- HERO SECTION -----*/}
  <section>

    <div class="grid grid-cols-2 gap-5 ml-[375px]">

      <div class="flex flex-col gap-y-[60px] items-end">

        <div class="bg-[#BCA88D] h-[7.5rem] w-[50rem] rounded-2xl">
          <h3 className='items-center flex flex-row gap-10'> 
            <h1>Delayed: {delay} </h1>
            <h1>Completed: {completed} </h1>
            <h1>Late: {late} </h1>
            <h1>Shared: {shared} </h1>
            <h1>created: {created}</h1>
          </h3>
        </div>

        <div class="bg-[#BCA88D] h-[30rem] w-[50rem] rounded-2xl">USER</div>
      </div>

      <div class="grid grid-cols-1 gap-5 justify-end items-end">


        <div class="bg-[#BCA88D] h-[10rem] w-[25rem] rounded-2xl">
            Welcome, {name}!
        </div>

        <div class="bg-[#BCA88D] h-[30rem] w-[25rem] rounded-2xl">INBOX

        </div>

      </div>

    </div>     
  
  
  
  
  </section>
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