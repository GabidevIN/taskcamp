import {useState, useEffect} from 'react'
import Login from '../login';
import axios from 'axios';
import { Link } from 'react-router-dom';

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

// ----- SCHEDULE SYSTEM
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [date, setDate] = useState(new Date());

  const year = date.getFullYear();
  const month = date.getMonth();
  const today = new Date();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setDate(new Date(year, month - 1, 1));
  const nextMonth = () => setDate(new Date(year, month + 1, 1));
  
  const generateDays = () => {
  const days = [];
  
// ----- DAYS
  for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }

// ----- MONTHS
  for (let day = 1; day <= lastDate; day++) {
    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

      days.push(
      <div
        key={day}
        className={`flex items-center justify-center h-12 rounded-lg cursor-pointer transition 
        ${isToday ? "bg-blue-500 text-white" : "hover:bg-gray-700"}`}
        onClick={() => alert(`Selected: ${day}/${month + 1}/${year}`)}>        {/* Alert for selected day -- WHEN CLICK CAN ADD A NOTE*/}

        
        {day}
      </div>
    );
  }
  return days;
};








// ----- function button

return (
  <>   
    <div className="w-screen h-screen bg-gradient-to-r from-[#948997] to-[#393e3e] text-white p-4 rounded">
    {    
      auth ?
      <>
        <h3 className="text-center text-2xl mb-4">Welcome, {name}!</h3>
        <div className="flex gap-2 mb-4">
          <Link to="/" onClick={logout} className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">LOGOUT</Link>
          <Link to="/Main" className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-800">SCHEDULE</Link>
          <Link to="/Notes" className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-800">NOTE</Link>
          <Link to="/Profile" className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-800">PROFILE</Link>
          <Link to="/Createtask" className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-800">CREATE TASK</Link>
        </div>



{/*SCHEDULE SYSTEM*/}
      <div>
        <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth}>PREVIOUS</button>
        <h2 className="text-xl font-semibold">
          {date.toLocaleString("default", { month: "long" })} {year}
        </h2>
        <button onClick={nextMonth}>NEXT</button>
      </div>

      <div className="grid grid-cols-7 text-center mb-2 font-bold">
        {dayNames.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">{generateDays()}</div>
    </div>

      </>
        /* USER IS NOT*/
        :
      <>
        <h3>{message}</h3>
        <h3>Login Now</h3>
        <Link to = "/login" className="block text-center bg-green-600 text-white px-6 py-2 w-full rounded-none hover:bg-green-700">LOGIN</Link>
      </>
    }
    </div>
  </>
  )
}

export default Main