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

  // ----- Noting System
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
        <div class="flex flex-col gap-y-[60px] items-end">

        {/*----- CALENDAR SYSTEM  -----*/}
          <div class="bg-[#BCA88D] h-[25rem] w-[35rem] rounded-2xl"> calendar

          </div>

        {/*----- CURRENT EVENT SYSTEM  -----*/}
          <div class="bg-[#BCA88D] h-[20rem] w-[35rem] rounded-2xl"> event calendar

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
          <div className="bg-[#BCA88D] h-[37.5rem] w-[27.5rem] rounded-2xl flex">
            TASK
            
          </div>

          {/*----- NOTES -----*/}
          <div className="bg-[#BCA88D] h-[37.5rem] w-[27.5rem] rounded-2xl flex p-3 hover:shadow-lg hover:scale-[101%] transition duration-500 ease-in-out">
            <div className='flex flex-col items-center w-full '>
              
            <button className='bg-[#BCA88D] w-[50px] h-[50px] flex items-center justify-center rounded-[20px]'>
              <img src={iconMenu} onClick={() => OpenNoting(!noting)} alt="menu" className="w-9 h-9 object-contain scale-75 "></img>
            </button>

              <div className='bg-[#3E3F29] w-full p-2 rounded-2xl h-screen overflow-y-auto scrollbar-hide '>
                {notes.length > 0 ? (
                  [...notes]
                    .sort((a, b) => b.id - a.id)
                    .map((note) => (
                      <div key={note.id}  className="mb-4 p-2 bg-[#35361F] outline outline-[#BCA88D] outline-[1px] rounded-2xl w-full text-white shadow cursor-pointe "
                        onClick={() => alert(`Note ID: ${note.id}`)}>
                        <h3 className="font-bold">{note.title}</h3>

                        <p>{note.content}</p>

                        <button onClick={(e) => { e.stopPropagation(); deleteNotes(note.id); }}
                          className="mt-2 bg-red-600 px-3 py-1 rounded hover:bg-red-700">  Delete </button>
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

        <ul className="space-y-4 text-center">

          <li className="hover:bg-gray-600 p-2 rounded" onClick={() => OpenTask(false)}>Close</li>
        </ul>
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