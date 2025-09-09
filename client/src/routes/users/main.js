import {useState, useEffect, useRef} from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { menu } from 'framer-motion/client';
import iconMenu from "../../assets/menuINC.png";
import iconComp from "../../assets/completedINC.png";
import iconLate from "../../assets/lateINC.png";
import iconDelayed from "../../assets/delayedINC.png";
import iconCreate from "../../assets/createdINC.png";


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

  const [page, setPage] = useState(0);
  const totalPages = 4;

  const nextPage = () => {
    setPage(prev => (prev + 1) % totalPages); // loops back to 0
  };

  const prevPage = () => {
    setPage(prev => (prev - 1 + totalPages) % totalPages); // loops to last page
  };

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

// ----- STATS DISPLAY
const StatBox = ({ icon, label, value }) => (
  <div className="bg-[#3E3F29] h-[100px] w-[150px] rounded-2xl flex flex-col items-center justify-center gap-y-4 
  hover:bg-[#A8BBA3] hover:shadow-lg hover:scale-[103%] transition duration-500 ease-in-out">
    <img src={icon} alt={label} className="w-9 h-9 object-contain scale-125 pt-[10px]" />

    <div className="text-black bg-[#BCA88D] w-[125px] text-center rounded-[15px] text-lg">

      {label}: {value}
      
    </div>
  </div>
);

// ----- ONCLICK ACTIONS
  const [Menu, OpenMenu] = useState(false);
  const [noting, OpenNoting] = useState(false);
  const [Tasking, OpenTask] = useState(false);
  const [Scheded, OpenSched] = useState(false);



// ----- NOTING SYSTEM
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const fetched = useRef(false)

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      const res = await axios.post('http://localhost:8081/notes', { title, content }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(prev => [...prev, res.data]);
      setTitle('');
      setContent('');
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  // ----- FETCH NOTES
  useEffect(() => {
      if (fetched.current) return;
      fetched.current = true;

      const fetchNotes = async () => {
        try {
          const res = await axios.get('http://localhost:8081/notes', { withCredentials: true });
          console.log("📥 Notes fetched:", res.data);
          if (Array.isArray(res.data)) {
            setNotes(res.data);
          } else {
            console.warn("Unexpected response:", res.data);
            setNotes([]);
          }
        } catch (err) {
          console.error("Error fetching notes:", err);
        }
      };
    fetchNotes();
  }, []);

  // ----- Deleting Notes
  const deleteNotes = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:8081/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.Status === "Deleted") {
        setNotes(prev => prev.filter(note => note.id !== id));      
      } else {
        console.warn(res.data.Status);
      }
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

// ----- TASKING SYSTEM
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [objective, setObjective] = useState(''); 
  const [task, setTask] = useState([]);


  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim() || !objective.trim()) return;

    try {
      await axios.post('http://localhost:8081/createtask', 
        { title, objective, time, date }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchTask();
      setTitle('');
      setObjective('');
      setTime('');
      setDate('');
    } catch (err) {
      console.error("Error adding Task:", err);
    }
  };

 // ----- FETCH TASK
  const fetchTask = async () => {
    try {
      const res = await axios.get('http://localhost:8081/createtask', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(res.data)) {
        setTask(res.data);
      } else {
        console.warn("Unexpected response:", res.data);
        setTask([]);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTask();
  }, []);

const deleteTask = async (id) => {
  try {
    const res = await axios.delete(`http://localhost:8081/createtask/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.data.Status === "DeletedTask") {
      setTask(prev => prev.filter(task => task.id !== id));      
    } else {
      console.warn(res.data.Status);
    }
  } catch (err) {
    console.error("Error deleting Task:", err);
  }
};

// ----- Complete Task
const CompleteTask = async (id) => {
  try {
    const res = await axios.patch(`http://localhost:8081/createtask/${id}`, 
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.Status === "CompletedTask") {
      setTask(prev => 
        prev.map(task => 
          task.id === id ? { ...task, completed: 1, ongoing: 0 } : task
        )
      );
    } else {
      console.warn(res.data.Status);
    }
  } catch (err) {
    console.error("Error completing Task:", err);
  }
};

// ----- SCHEDULE  SYSTEM
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [DateSCHD, setDateSCDH] = useState(new Date());
  const dateObj = new Date(DateSCHD);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const today = new Date();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setDateSCDH(new Date(year, month - 1, 1));
  const nextMonth = () => setDateSCDH(new Date(year, month + 1, 1));

  const [selectedDay, setSelectedDay] = useState(null);

  const [schedules, setSchedules] = useState([]);
  
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

      fetchSchedules();
      setTitle("");
      setContent("");
      setSelectedDay(null);
    } catch (err) {
      console.error("Error adding Schedule:", err);
    }
  };


const fetchSchedules = async () => {
  try {
    const response = await axios.get("http://localhost:8081/schedule", {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Schedules fetched:", response.data);
    setSchedules(Array.isArray(response.data) ? response.data : []);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    setSchedules([]);
  }
};
  useEffect(() => {
    if (!fetched.current) {
      fetched.current = true;
      fetchSchedules();
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, []);

  // ----- Deleting Notes
  const deletesched = async (id) => {
      try {
        const res = await axios.delete(`http://localhost:8081/schedule/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.Status === "Deleted") {
          setSchedules(prev => prev.filter(sched => sched.id !== id));

        } else {
          console.warn(res.data.Status);
        }
      } catch (err) {
        console.error("Error deleting note:", err);
      }
    };



  
const generateDays = () => {
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-12"></div>);
  }

  for (let day = 1; day <= lastDate; day++) {
    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    days.push(
      <div key={day} className="relative">
        <div
          className={`flex flex-col text-white items-center justify-center h-12 rounded-lg cursor-pointer bg-[#3E3F29] transition ${
            isToday ? "bg-[#BCA88D] outline outline-black text-white outline-[2px]" : "hover:bg-gray-70 20 hover:shadow-lg hover:sc@ale-[95%] transition duration-500 ease-in-out rounded outline-[#BCA88D] cursor-pointer"
          }`}
          onClick={() => setSelectedDay(day)}
        >
          {day}
        </div>

        {/* ---- ADDING NEW SCHEDULE (popup form) */}
        {selectedDay === day && (
          <div className="absolute top-14 left-0 bg-gray-200 text-black p-2 rounded shadow-md w-48 z-10">
            <form onSubmit={(e) => handleSchedule(e, day)}>
              <p className="text-sm font-bold mb-1">
                Add note for {day}/{month + 1}/{year}
              </p>
              <input  placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mb-1 p-1 border rounded" />
              <input laceholder="Content" value={content} onChange={(e) => setContent(e.target.value)}  className="w-full mb-1 p-1 border rounded" />
              <button  type="submit" className="bg-blue-500 text-white px-2 py-1 rounded w-full"  >
                Save
              </button>
            </form>
                      <button className="hover:bg-gray-600 p-2 rounded" onClick={() => setSelectedDay(null)}>Close</button>
          </div>
        )}
      </div>
    );
  }
  return days;
};

return (
  <>   
    <div>
    <title>MAIN</title>
    {    
      auth ?
      <>
{/*----- NAVBAR -----*/}
    <div className='fixed flex justify-center w-full pt-[30px]'>
      <button className='bg-[#BCA88D] w-[50px] h-[50px] flex items-center justify-center rounded-[20px]
      hover:shadow-lg hover:scale-110 transition duration-500 ease-in-out ring-0 hover:ring-[3px] hover:ring-black'>
        <img src={iconMenu} onClick={() => OpenMenu(!Menu)} alt="menu" className="w-9 h-9 object-contain scale-75"></img>
      </button>
    </div>

{/*----- HERO SECTION -----*/}
  <section>
    <div className="flex items-center justify-center w-screen min-h-screen -space-x-20 ml-[-175px] pt-[30px]">
      <div class="grid grid-cols-2 gap-5">


  {/*----- FIRST GRID  -----*/}
        <div class="flex flex-col gap-y-[25px] items-end">

        {/*----- CALENDAR SYSTEM  -----*/}

          <div class="bg-[#BCA88D] h-[25rem] w-[35rem] rounded-2xl p-4 hover:shadow-lg hover:scale-[102%] transition duration-500 ease-in-out"> 
            <div className="flex justify-between items-center mb-4">
              <button onClick={prevMonth} className='px-3 py-1 bg-[#3E3F29] outline outline-[2px] outline-black text-white rounded-xl'>PREVIOUS</button>
              <h2 className="text-xl font-semibold">
                {DateSCHD.toLocaleString("default", { month: "long" })} {year}
              </h2>
              <button onClick={nextMonth} className='px-3 py-1 bg-[#3E3F29] outline outline-[2px] outline-black text-white rounded-xl'>NEXT</button>
            </div>

            <div className="grid grid-cols-7 text-center mb-2 font-bold">
              {dayNames.map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">{generateDays()}</div>
          </div>

        {/*----- CURRENT EVENT SYSTEM  -----*/}
          <div className="bg-[#BCA88D] h-[357.5px] w-[35rem] rounded-2xl p-4 hover:shadow-lg hover:scale-[102%] transition duration-500 ease-in-out"> 
            <h3 className="text-lg font-bold mb-2 text-white text-center">Schedules</h3>
            <div className="bg-[#3E3F29] w-full p-2 rounded-2xl h-full max-h-[292.25px] overflow-y-auto scrollbar-hide">
              {schedules.length > 0 ? (
                [...schedules]
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((sched, idx) => (
                    <div key={idx} title={`${sched.title}: ${sched.content}`}
                      className="bg-transparent text-white rounded-2xl px-2 py-1 mb-2 outline outline-[1px]
                      hover:shadow-lg hover:scale-[95%] transition duration-500 ease-in-out rounded outline-[#BCA88D] cursor-pointer">
                      <strong>{sched.title}</strong><br />
                      <span className="text-sm">{sched.content}</span><br />
                      <span className="text-xs italic">
                        {new Date(sched.date).toDateString()}
                      </span>
                                              <button onClick={(e) => { e.stopPropagation(); deletesched(sched.id); }}
                          className="mt-2 bg-red-400 px-3 py-1 rounded hover:bg-red-700">  Delete </button>
                    </div>
                  ))
              ) : (
                <p className="text-gray-400 text-sm">No schedules yet</p>
              )}
            </div>
          </div>
        </div>


  {/*----- SECOND GRID  -----*/}
        <div class="grid grid-cols-1 gap-5 justify-end items-end ">

        {/*----- USER STATS -----*/}
          <div className="bg-[#BCA88D] h-[10rem] w-[56.5rem] rounded-2xl flex justify-center items-center gap-[65px]
          hover:scale-[101%] transition duration-500 ease-in-out">
            <StatBox icon={iconCreate} label="Created" value={created} />
            <StatBox icon={iconComp} label="Completed" value={completed} />
            <StatBox icon={iconLate} label="Late" value={late} />
            <StatBox icon={iconDelayed} label="Delayed" value={delay} />
          </div>

  {/*----- THIRD GRID  -----*/}
        <div className="grid grid-cols-2 gap-5 w-[56.5rem]">
          
          {/*----- TASK -----*/}
          <div className="bg-[#BCA88D] h-[37.5rem] w-[27.5rem] rounded-2xl flex p-3 hover:shadow-lg hover:scale-[102%] transition duration-500 ease-in-out">
            <div className='flex flex-col items-center w-full '>

              <div className='flex flex-row items-center w-full justify-center gap-[8rem]'>
                <button onClick={prevPage} className="px-3 py-1 bg-[#3E3F29] outline outline-[2px] outline-black text-white rounded-xl">Prev</button>
                <button className='bg-[#BCA88D] w-[35px] h-[35px] flex items-center justify-center rounded-[10px] m-2 hover:bg-white transition-colors duration-300'>
                  <img src={iconMenu} onClick={() => OpenTask(!Tasking)} alt="menu" className="w-9 h-9 object-contain scale-75 "></img>
                </button>
                <button onClick={nextPage} className="px-3 py-1 bg-[#3E3F29] outline outline-[2px] outline-black text-white rounded-xl">Next</button>
              </div>

              <div className="overflow-hidden w-full h-full rounded-2xl ">
                <div className="flex w-[400%] h-full transition-transform duration-500 ease-in-out"  style={{ transform: `translateX(-${page * 25}%)` }} >

                {/*----- ON GOING -----*/}
                  <div className="w-[25%] flex-shrink-0 p-2 bg-[#3E3F29] h-full overflow-y-auto scrollbar-hide rounded-2xl">
                    <div className='w-full text-center outline rounded-2xl p-1 text-white mt-1 '>
                      ON GOING
                    </div>
                    {task.length > 0 ? (
                      [...task]
                        .filter(task => task.ongoing === 1 && task.completed === 0)
                        .sort((a, b) => b.id - a.id)
                        .map(task => {
                          const formattedDate = task.date ? task.date.split('T')[0] : '';
                          const formattedTime = task.time ? task.time.slice(0, 5) : '';

                          return (
                            <div key={task.id} className="mb-4 p-3 outline outline-[1px] outline-[#BCA88D]  text-white rounded cursor-pointer mt-4 rounded-2xl
                            hover:shadow-lg hover:scale-[95%] transition duration-500 ease-in-out rounded outline-[#BCA88D] cursor-pointer"  onClick={() => alert(`Note ID: ${task.id}`)} >
                              <h3 className="font-bold">{task.title}</h3>
                              <p>{task.objective}</p>
                              <p>{formattedTime}</p>
                              <p>{formattedDate}</p>
                              <p>Ongoing</p>
                                <div className='items-center flex justify-center gap-4'>
                                  <button onClick={e => {e.stopPropagation(); deleteTask(task.id);}} 
                                  className=' bg-red-400 w-full h-full p-2 rounded-2xl outline outline-[1px] outline-black'>
                                    Delete Task</button>
                                  <button  onClick={e => { e.stopPropagation(); CompleteTask(task.id);}}
                                  className='bg-green-400 w-full h-full p-2 rounded-2xl outline outline-[1px] outline-black'>
                                    Complete Task</button>
                                </div>
                            </div>
                          );
                        })
                      ) : (
                        <p>No Task found. Create one above!</p>
                      )}
                    </div>
                  {/*------ LATE -----*/}
                  <div className="w-[25%] flex-shrink-0 p-2 bg-[#3E3F29] h-full overflow-y-auto scrollbar-hide rounded-2xl">
                    <div className='w-full text-center outline rounded-2xl p-1 text-white mt-1 '>
                      LATE
                    </div>
                    {task.length > 0 ? (
                      [...task]
                        .filter(task => task.ongoing === 0 && task.completed === 0)
                        .sort((a, b) => b.id - a.id)
                        .map(task => {
                          const formattedDate = task.date ? task.date.split('T')[0] : '';
                          const formattedTime = task.time ? task.time.slice(0, 5) : '';

                          return (
                            <div key={task.id} className="mb-4 p-3 outline outline-[1px] outline-[#BCA88D]  text-white rounded cursor-pointer mt-4 rounded-2xl
                            hover:shadow-lg hover:scale-[95%] transition duration-500 ease-in-out rounded outline-[#BCA88D] cursor-pointer"  onClick={() => alert(`Note ID: ${task.id}`)} >
                              <h3 className="font-bold">{task.title}</h3>
                              <p>{task.objective}</p>
                              <p>{formattedTime}</p>
                              <p>{formattedDate}</p>
                              <p>Ongoing</p>
                                <div className='items-center flex justify-center gap-4'>
                                  <button onClick={e => {e.stopPropagation(); deleteTask(task.id);}} 
                                  className=' bg-red-400 w-full h-full p-2 rounded-2xl outline outline-[1px] outline-black'>
                                    Delete Task</button>
                                  <button  onClick={e => { e.stopPropagation(); CompleteTask(task.id);}}
                                  className='bg-green-400 w-full h-full p-2 rounded-2xl outline outline-[1px] outline-black'>
                                    Complete Task</button>
                                </div>
                            </div>
                          );
                        })
                      ) : (
                        <p>No Task found. Create one above!</p>
                      )}
                    </div>

                  {/*----- COMPLETED -----*/}
                  <div className="w-[25%] flex-shrink-0 p-2 bg-[#3E3F29] h-full overflow-y-auto scrollbar-hide rounded-2xl">
                    <div className='w-full text-center outline rounded-2xl p-1 text-white mt-1 '>
                      COMPLETED
                    </div>
                    {task.length > 0 ? (
                      [...task]
                        .filter(task => task.completed === 1 && task.ongoing === 1)
                        .sort((a, b) => b.id - a.id)
                        .map(task => {
                          const formattedDate = task.date ? task.date.split('T')[0] : '';
                          const formattedTime = task.time ? task.time.slice(0, 5) : '';

                          return (
                            <div key={task.id} className="mb-4 p-3 outline outline-[1px] outline-[#BCA88D]  text-white rounded cursor-pointer mt-4 rounded-2xl
                            hover:shadow-lg hover:scale-[95%] transition duration-500 ease-in-out rounded outline-[#BCA88D] cursor-pointer"  onClick={() => alert(`Note ID: ${task.id}`)} >
                              <h3 className="font-bold">{task.title}</h3>
                              <p>{task.objective}</p>
                              <p>{formattedTime}</p>
                              <p>{formattedDate}</p>
                              <p>Ongoing</p>
                                <div className='items-center flex justify-center gap-4'>
                                  <button className=' bg-red-400 w-full h-full p-2 rounded-2xl outline outline-[1px] outline-black' onClick={() => deleteTask(task.id)}>Hide Task</button>
                                </div>
                            </div>
                          );
                        })
                      ) : (
                        <p>No Task found. Create one above!</p>
                      )}
                    </div>

                  {/*----- DELAYED -----*/}
                  <div className="w-[25%] flex-shrink-0 p-2 bg-[#3E3F29] h-full overflow-y-auto scrollbar-hide rounded-2xl">
                    <div className='w-full text-center outline rounded-2xl p-1 text-white mt-1 '>
                      DELAYED
                    </div>
                    {task.length > 0 ? (
                      [...task]
                        .filter(task => task.ongoing === 0 &&task.completed === 1)
                        .sort((a, b) => b.id - a.id)
                        .map(task => {
                          const formattedDate = task.date ? task.date.split('T')[0] : '';
                          const formattedTime = task.time ? task.time.slice(0, 5) : '';

                          return (
                            <div key={task.id} className="mb-4 p-3 outline outline-[1px] outline-[#BCA88D]  text-white rounded cursor-pointer mt-4 rounded-2xl
                            hover:shadow-lg hover:scale-[95%] transition duration-500 ease-in-out rounded outline-[#BCA88D] cursor-pointer"  onClick={() => alert(`Note ID: ${task.id}`)} >
                              <h3 className="font-bold">{task.title}</h3>
                              <p>{task.objective}</p>
                              <p>{formattedTime}</p>
                              <p>{formattedDate}</p>
                              <p>Ongoing</p>
                                <div className='items-center flex justify-center gap-4'>
                                  <button className=' bg-red-400 w-full h-full p-2 rounded-2xl outline outline-[1px] outline-black' onClick={() => deleteTask(task.id)}>Hide Task</button>
                                </div>
                            </div>
                          );
                        })
                      ) : (
                        <p>No Task found. Create one above!</p>
                      )}
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/*----- NOTES -----*/}
          <div className="bg-[#BCA88D] h-[37.5rem] w-[27.5rem] rounded-2xl flex p-3 hover:shadow-lg hover:scale-[102%] transition duration-500 ease-in-out">
            <div className='flex flex-col items-center w-full '>
              
            <button className='bg-[#BCA88D] w-[50px] h-[50px] flex items-center justify-center rounded-[20px] m-[7.5px]'>
              <img src={iconMenu} onClick={() => OpenNoting(!noting)} alt="menu" className="w-9 h-9 object-contain scale-75 "></img>
            </button>

              <div className='bg-[#3E3F29] w-full p-2 rounded-2xl h-screen overflow-y-auto scrollbar-hide '>
                {notes.length > 0 ? (
                  [...notes]
                    .sort((a, b) => b.id - a.id)
                    .map((note) => (
                      <div key={note.id}  className="mb-4 p-2 bg-[#35361F] outline outline-[#BCA88D] outline-[1px] rounded-2xl w-full text-white shadow cursor-pointer
                      hover:shadow-lg hover:scale-[95%] transition duration-500 ease-in-out rounded outline-[#BCA88D] cursor-pointer"
                        onClick={() => alert(`Note ID: ${note.id}`)}>
                        <h3 className="font-bold">{note.title}</h3>

                        <p>{note.content}</p>

                        <button onClick={(e) => { e.stopPropagation(); deleteNotes(note.id); }}
                          className="mt-2 bg-red-400 px-3 py-1 rounded hover:bg-red-700">  Delete </button>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-500">No notes found. Create one above!</p>
                )}
              </div>
            </div>
          </div>
   
        </div>
        </div>
      </div>     
    </div>
  </section>

{/*----- MENU SYSTEM-----*/}
  {Menu && (
          <div
            onClick={() => OpenMenu(false)}
            className="fixed inset-0 bg-black bg-opacity-0 z-10"
          ></div>
        )}

      <div
        className={`fixed top-0 left-0 h-full w-full bg-black text-white p-5 transform transition-transform duration-300 z-20 flex items-center justify-center h-screen opacity-75
          bg-opacity-0
        ${Menu ? 
          "translate-y-0 bg-opacity-50" 
          : 
          "-translate-y-full bg-opacity-50"}`}>

        <ul className="space-y-4 text-center">

          <li className="hover:bg-gray-600 p-2 rounded" onClick={() => OpenMenu(false)}>Close</li>
        </ul>
      </div>

{/*----- TASKING SYSTEM-----*/}
  {Tasking && (
          <div
            onClick={() => OpenTask(false)}
            className="fixed inset-0 bg-black bg-opacity-0 z-10" ></div> )}

      <div
        className={`fixed top-0 left-0 h-full w-full bg-black text-white p-5 transform transition-transform duration-300 z-20 flex items-center justify-center h-screen opacity-75
          bg-opacity-0
        ${Tasking ? 
          "translate-y-0 bg-opacity-50" 
          : 
          "-translate-y-full bg-opacity-50"}`}>

          <div className="mt-6">
            <h2 className="text-xl mb-2">Your TASK</h2>
            <form onSubmit={handleCreateTask} className="mb-4">

              <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="block w-full mb-2 p-2 text-black rounded"  />
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="p-2 rounded text-black"/>
              <input  type="date" value={date} onChange={(e) => setDate(e.target.value)} className="p-2 rounded text-black ml-2" />

              <div className="mt-4 text-white"> 
                <p>Selected Time: {time || "None"}</p>
                <p>Selected Date: {date || "None"}</p>
              </div>

              <textarea className="block w-full mb-2 p-2 text-black rounded" placeholder="objective" value={objective} onChange={e => setObjective(e.target.value)} />
              
              <button type="submit" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Add Task</button>
            </form>
              <button className="hover:bg-gray-600 p-2 rounded" onClick={() => OpenTask(false)}>Close</button>

          </div>
      </div>

{/*----- NOTING SYSTEM-----*/}
  {noting && (
      <div onClick={() => OpenNoting(false)} className="fixed inset-0 bg-black bg-opacity-0 z-10"></div>
      )}

    <div className={`fixed top-0 left-0 h-full w-full bg-black text-white p-5 transform transition-transform duration-300 z-20 flex items-center justify-center h-screen 
      opacity-100 bg-opacity-0 backdrop-blur-sm
      ${noting ?  "translate-y-0 bg-opacity-50"  
      :  "-translate-y-full opacity-100"}`}>
      <div className={`bg-gray-800 h-[800px] w-[500px] p-4 rounded-[25px] shadow-lg transition-all duration-500 
        ${ noting ? "translate-y-0 bg-opacity-100 opacity-100" 
        : "opacity-0 pointer-events-none" }`} >   

        <h2 className="text-xl mb-2 text-center text-white">Your Notes</h2>
        <form onSubmit={handleAddNote} className="mb-4">
          
          <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}
            className="block w-full mb-2 p-2 text-black rounded"/>

          <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)}
            className="block w-full  mb-2 p-2 text-black rounded resize-none h-[600px]"/>

          <button type="submit" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
            Add Note </button>
        </form>
          <button className="hover:bg-gray-600 p-2 rounded" onClick={() => OpenNoting(false)}>Close</button>
      </div>
    </div>

{/*----- SCHEDULING SYSTEM-----*/}
  {Scheded && (
          <div
            onClick={() => OpenSched(false)}
            className="fixed inset-0 bg-black bg-opacity-0 z-10"
          ></div>
        )}

      <div
        className={`fixed top-0 left-0 h-full w-full bg-black text-white p-5 transform transition-transform duration-300 z-20 flex items-center justify-center h-screen opacity-75
          bg-opacity-0
        ${Scheded ? 
          "translate-y-0 bg-opacity-50" 
          : 
          "-translate-y-full bg-opacity-50"}`}>

        <ul className="space-y-4 text-center">

          <li className="hover:bg-gray-600 p-2 rounded" onClick={() => OpenSched(false)}>Close</li>
        </ul>
      </div>

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