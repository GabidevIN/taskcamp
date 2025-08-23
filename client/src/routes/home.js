import { useState, useEffect,useRef, use } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../index.css'; 
import { motion } from 'framer-motion';

function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showReg, setShowReg] = useState(false);

const handleAuthClick = (type) => (e) => {
  e.preventDefault();
  setShowLogin(type === "login");
  setShowReg(type === "register");
};

const showreg = () => {
  setShowLogin(false);
  setShowReg(true);
};

const showlog = () => {
  setShowLogin(true);
  setShowReg(false);
};

const closebtn = () => {
  setShowLogin(false);
  setShowReg(false);
};
// ----- REGISTRATION SYSTEM

  const [regis, regvalue] = useState({ name: '', email: '', pass: ''})
  const navigate = useNavigate();
  const regisSub = (event) => {
    event.preventDefault();

// ----- MUST FILLED BY USER 
    if(!regis.name || !regis.email || !regis.pass) {
      alert("Please fill all fields");
      return;
    }   

// ----- ACCOUNT CREATION (IF FILLED)
    axios.post('http://localhost:8081/register', regis)
    .then(res => {
      if (res.data.Status === "Success") {
        alert("ACCOUNT CREATED");
        navigate('/main')
      } 

      else if (res.data.Status === "Duplicate") {
        alert("ACCOUNT EXISTED");
      } 
      else {
        alert("ERROR CREATING ACCOUNT");
      }
    })
    .then(err => console.log(err));
  }

// ----- LOGIN SYSTEM
  const [login, loginvalue] = useState({email: '', pass: ''})
  axios.defaults.withCredentials = true;
  const loginSub = (event) => {
    event.preventDefault();
    axios.post('http://localhost:8081/login', login)
    .then(res => {
      if (res.data.Status === "User_Success") {
        navigate('/main')
      } else if (res.data.Status === "Admin_Success") {
        navigate('/admin/adminMain')
      } else {
        alert("Incorrect Email or Password");
      }
    })
    .catch(err => {
      console.log("Axios error:", err);
      alert("Something went wrong with the server.");
    });
}

// ----- SNAP FADE IN
  const heroRef = useRef();
  const aboutRef = useRef();
  const contactRef = useRef();

  const [visible, setVisible] = useState({
    hero: false,
    about: false,
    contact: false,
  });

  useEffect(() => {
    const observerOptions = { threshold: 0.5 };

    const heroObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible((v) => ({ ...v, hero: true }));
    }, observerOptions);
    const aboutObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible((v) => ({ ...v, about: true, }));
    }, observerOptions);
    const contactObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible((v) => ({ ...v, contact: true }));
    }, observerOptions);

    if (heroRef.current) heroObserver.observe(heroRef.current);
    if (aboutRef.current) aboutObserver.observe(aboutRef.current);
    if (contactRef.current) contactObserver.observe(contactRef.current);

    return () => {
      heroObserver.disconnect();
      aboutObserver.disconnect();
      contactObserver.disconnect();
    };
  }, []);

  const fadeClass = (isVisible) =>
    isVisible
      ? "opacity-100 transition-opacity duration-1000 ease-in-out"
      : "opacity-0";


// ----- ABOUT US/CONTACTS SCROLL
  const about = useRef(null);
  const contact = useRef(null);
  const hero = useRef(null);

  const scrollto = (section) => {
    if (section === "about" && about.current) {
      about.current.scrollIntoView({ behavior: "smooth" });
    }
    if (section === "contact" && contact.current) {
      contact.current.scrollIntoView({ behavior: "smooth" });
    }
    if (section === "return" && contact.current) {
      hero.current.scrollIntoView({ behavior: "smooth" });
    }
  };

return (
<div className="bg-[#3E3F29]">
    <title>TASKCAMP</title>

    {/*----- NAVBAR -----*/}
    <div className="fixed inset-0 flex justify-between items-center mx-auto mt-[25px]  z-10
    h-[55px] w-[75px] sm:w-[50px] md:w-[750px] lg:max-xl:w-[1050px]">

      <header className="flex justify-between items-center h-[55px] w-full bg-[#3E3F29] shadow-[0_25px_70px_-10px_rgba(0,0,0,0.85)] 
      mx-auto rounded-[25px] mt-[25px] sm:mx-0 sm:px-0 px-6">

        <button onClick={() => scrollto("return")} className="hidden sm:block text-[#BCA88D] text-lg font-bold px-6 sm:mx-0 mx-auto">TASKUP</button>
        <button onClick={() => scrollto("null")} className="text-[#BCA88D] text-lg font-bold px-6 sm:mx-0 mx-auto cursor-pointer"> </button>

        <nav className="flex">
          <button className="sm:block hidden hover text-[#BCA88D] font-heebo text-5 font-bold cursor-pointer p-2 m-1"
            onClick={() => scrollto("about")}>ABOUT US</button>

          <a className="sm:block hidden text-[#BCA88D] font-heebo text-5 font-bold cursor-pointer p-2 m-1"
            onClick={() => scrollto("contact")}>CONTACTS</a>

          <a className="sm:block hidden text-white w-[100px] font-bold bg-[#BCA88D] cursor-pointer rounded-tl-[15px] rounded-bl-[15px] p-2 m-1 text-center"
            onClick={handleAuthClick("login")}>LOGIN</a>

          <a className="sm:block hidden text-white w-[100px] font-bold bg-[#BCA88D] cursor-pointer rounded-tr-[15px] rounded-br-[15px] p-2 m-1 text-center"
            onClick={handleAuthClick("register")}>REGISTER</a>
        </nav>
      </header>
    </div>

{/*----- PAGES -----*/}
    <div className="h-screen overflow-y-scroll scroll-smooth snap-y snap-mandatory relative scrollbar-hide">

{/*----- HERO PAGE-----*/}
      <section className={`h-screen flex flex-col items-center justify-center text-white text-center snap-center gap-2
      ${fadeClass( visible.hero )}`} ref={(el) => {heroRef.current = el;hero.current = el;}}>

        <motion.h1
          className="font-bold font-bold font-heptoslab text-[#BCA88D] text-[65px] sm:text-[65px] md:text-[100px] lg:text-[125px]"
          initial={{ scale: 1.4, x: 0, y: 0}}
          animate={visible.hero ? { scale: 1.25, x: 0, y: 0 } : { scale: 1, x: 0, y: 0 }}
          transition={{duration: 1.5, times: [0.5, 0.5, 1],   ease: "easeInOut"}}>
          TASKUP
        </motion.h1>

        <h2 className="text-[20px] font-bold font-heptoslab text-[#BCA88D] max-w-2xl">
          Your all in one app for scheduling, note taking, and task management designed to keep your life organized and on track.
        </h2>

      </section>

{/*----- BODY//ABOUT PAGE-----*/}
      <section ref={(el) => { aboutRef.current = el; about.current = el; }}className={`h-screen bg-[#BCA88D] flex flex-col items-center 
        justify-start text-white text-4xl text-center snap-center ${fadeClass(visible.about)}`}>

      <h1
        className={`font-bold font-heptoslab text-[#3E3F29] leading-[1.1] tracking-tight whitespace-nowrap transition-all duration-[1500ms] ease-in-out
          mt-[80px] sm:mt-[100px] md:mt-[150px] lg:mt-[200px]
          ${visible.about 
            ? "opacity-100 scale-[0.4] -translate-y-[5px] md:-translate-y-[55px] lg:-translate-y-[125px] text-[100px] sm:text-[100px] md:text-[100px] lg:text-[125px]" 
            : "opacity-0 scale-0 translate-y-0"
          }`}
      >
        ABOUT
      </h1>

    </section>

{/*----- FOOTER//CONTACTS PAGE-----*/}
      <section ref={(el) => {contactRef.current = el;contact.current = el;}}className={`h-screen bg-[#3E3F29] flex flex-col items-center 
        justify-start text-white text-4xl text-center snap-center ${fadeClass(visible.about)}`}>
        <h1
          className={`font-bold font-heptoslab text-[#BCA88D] leading-[1.1] tracking-tight whitespace-nowrap transition-all duration-[1500ms] ease-in-out
            mt-[80px] sm:mt-[100px] md:mt-[150px] lg:mt-[200px]
            ${visible.contact 
            ? "opacity-100 scale-[0.4] -translate-y-[5px] md:-translate-y-[55px] lg:-translate-y-[125px] text-[100px] sm:text-[100px] md:text-[100px] lg:text-[125px]" 
            : "opacity-0 scale-0 translate-y-0"
            }`}
        >
          CONTACTS
        </h1>

      </section>
    </div>

    {/*----- LOGIN FORM // HIDDEN -----*/}
    {showLogin && (
      <div className={"fixed inset-0 flex items-center justify-center z-50 backdrop-blur"}>
        <div className="bg-white text-black p-5 rounded w-[50rem] h-[30rem] rounded-[15px]">
          <button onClick={closebtn} className="mb-2">Close</button>
          <h2 className="text-center font-bold mb-4">LOGIN</h2>

          <form onSubmit={loginSub} className="space-y-3">
            
            <input className="border px-4 py-2 w-full rounded" required type="email" placeholder="Enter Email"
              onChange={e => loginvalue({ ...login, email: e.target.value })}/>

            <input className="border px-4 py-2 w-full rounded" type="password" placeholder="Enter Password"
              onChange={e => loginvalue({ ...login, pass: e.target.value })}/>

            <button type="submit" className="bg-green-600 text-white px-6 py-2 w-full hover:bg-green-700">
              LOGIN</button>
          </form>

          <div className="mt-4 text-center">
            <p>NO ACCOUNT?</p>
            <button onClick={showreg}
              className="bg-green-600 text-white px-6 py-2 w-full hover:bg-green-700"> 
              Register </button>
          </div>
        </div>
      </div>
    )}

{/*----- REGISTRATION FORM // HIDDEN -----*/}
    {showReg && (
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur ">
        <div className="bg-white text-black p-5 rounded w-[50rem] h-[30rem] rounded-[15px]">
          <div>
            <button onClick={closebtn}>Close</button>
            <h1 className='text-center font-bold '>REGISTER</h1>
            <form onSubmit={regisSub} className="space-y-3 max-w-md mx-auto mt-10"> 
              <input placeholder='Enter Name' 
              onChange={e => regvalue({...regis, name: e.target.value})} 
              className="border px-4 py-2 w-full rounded"/>

              <input placeholder='Enter Email' 
              required type="email"
              onChange={e => regvalue({...regis, email: e.target.value})} 
              className="border px-4 py-2 w-full rounded"/>

              <input placeholder='Enter Password' 
              onChange={e => regvalue({...regis, pass: e.target.value})} 
              className="border px-4 py-2 w-full rounded"/>
              
              <button type="submit" className="bg-green-600 text-white px-4 py-2 w-full rounded-none hover:bg-green-700">SIGN UP</button>
              <h1 className='text-center'>ALREADY HAVE ACCOUNT</h1>
              <button onClick={showlog} className="block text-center bg-green-600 text-white px-6 py-2 w-full rounded-none hover:bg-green-700">LOGIN</button>
            </form>
          </div>
        </div>
      </div>
    )}

  </div>
  )
}

export default Home