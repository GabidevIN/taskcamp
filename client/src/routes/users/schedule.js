import {useState, useEffect} from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';

function Main() {
// ----- SESSION SYSTEM -----
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

// ----- LOGOUT SESSION
  const logout = () => {
    axios.get('http://localhost:8081/logout')
    .then(res => {
      window.location.reload(true);
    }).catch(err => console.log(err));
  }


// ----- SCHEDULE SYSTEM -----
 const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [date, setDate] = useState(new Date());
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const today = new Date();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setDate(new Date(year, month - 1, 1));
  const nextMonth = () => setDate(new Date(year, month + 1, 1));

  const generateDays = () => {
    const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-12"></div>);
  }

// ----- DATES GENERATION
  for (let day = 1; day <= lastDate; day++) {
    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

      days.push(
        <div key={day} className="relative">
          <div
            className={`flex items-center justify-center h-12 rounded-lg cursor-pointer transition 
              ${isToday ? "bg-blue-500 text-white" : "hover:bg-gray-700"}`}
            onClick={() => setSelectedDay(day)}
          >
            {day}
          </div>

          {selectedDay === day && (
            <div className="absolute top-14 left-0 bg-gray-200 text-black p-2 rounded shadow-md w-48">
{/* ----- MAKING SCHEDULED NOTES */}
              <form onSubmit={(e) => handleSchedule(e, day)}>
                <p className="text-sm font-bold mb-1">
                  Add note for {day}/{month + 1}/{year} </p>
                <input placeholder="Title"
                  value={title} onChange={(e) => setTitle(e.target.value)}
                  className="w-full mb-1"/>
                <input placeholder="Content"
                  value={content}onChange={(e) => setContent(e.target.value)}
                  className="w-full mb-1"/>
                <button type="submit"
                  className="bg-blue-500 text-white px-2 py-1 rounded w-full" > Save </button>
              </form>
            </div>
          )}
        </div>
      );
    }
    return days;
  };

// ----- SCHEDULE SAVING SYSTEM
  const [selectedDay, setSelectedDay] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [time, setTime] = useState('');
  const [token] = useState(localStorage.getItem('token') || '');

  const handleSchedule = async (e, chosenDay) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const chosenDate = new Date(year, month, chosenDay);

    try {
      await axios.post(
        "http://localhost:8081/schedule",
        { title, content, time, date: chosenDate.toISOString() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle('');
      setContent('');
      setSelectedDay(null);
    } catch (err) 
    {
    console.error("Error adding Schedule:", err);
  }
};


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