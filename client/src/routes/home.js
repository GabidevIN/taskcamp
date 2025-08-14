import { useState, useEffect,useRef } from 'react';
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
<div className="bg-[#3E3F29] ">
    <title>TASKCAMP</title>

    {/*----- NAVBAR -----*/}
    <div className="fixed inset-0 flex justify-between items-center h-[55px] w-[1250px] mx-auto mt-[25px] z-10">
      <header className="from-purple-500 via-pink-500 to-red-500 flex justify-between items-center h-[55px] w-[1250px] bg-[#3E3F29] shadow-2xl mx-auto rounded-[25px] mt-[25px] px-6">
        <button onClick={() => scrollto("return")} className="text-[#BCA88D] text-lg font-bold px-6">TASKUP</button>

        <nav className="flex">
          <button className="hover text-[#BCA88D] font-heebo text-5 font-bold cursor-pointer p-2 m-1"
            onClick={() => scrollto("about")}>ABOUT US</button>

          <a className="text-[#BCA88D] font-heebo text-5 font-bold cursor-pointer p-2 m-1"
            onClick={() => scrollto("contact")}>CONTACTS</a>

          <a className="text-white w-[100px] font-bold bg-[#BCA88D] cursor-pointer rounded-tl-[15px] rounded-bl-[15px] p-2 m-1 text-center"
            onClick={handleAuthClick("login")}>LOGIN</a>

          <a className="text-white w-[100px] font-bold bg-[#BCA88D] cursor-pointer rounded-tr-[15px] rounded-br-[15px] p-2 m-1 text-center"
            onClick={handleAuthClick("register")}>REGISTER</a>
        </nav>
      </header>
    </div>

{/*----- PAGES -----*/}
    <div className="h-screen overflow-y-scroll scroll-smooth snap-y snap-mandatory relative scrollbar-hide">

{/*----- HERO PAGE-----*/}
      <section className={`h-screen bg-[#3E3F29] flex flex-col items-center justify-center text-white text-4xl text-center snap-center 
      ${fadeClass( visible.hero )}`} ref={(el) => {heroRef.current = el;hero.current = el;}}>


        <motion.h1
          className="font-bold font-text-[125px] font-bold font-heptoslab text-[#BCA88D] text-[125px]"
          initial={{ scale: 1.4, x: 0, y: 0}}
          animate={visible.hero ? { scale: 1.25, x: 0, y: 0 } : { scale: 1, x: 0, y: 0 }}
          transition={{duration: 1.5, times: [0.5, 0.5, 1],   ease: "easeInOut"}}>
          TASKUP
        </motion.h1>


        <h2 className="text-[20px] font-bold font-heptoslab text-[#BCA88D] mt-10 max-w-2xl px-4">
          Your all in one app for scheduling, note taking, and task management designed to keep your life organized and on track.
        </h2>

      </section>

{/*----- BODY//ABOUT PAGE-----*/}
      <section ref={(el) => {aboutRef.current = el;about.current = el;}} className={`h-screen bg-[#BCA88D] flex flex-col items-center justify-center text-white text-4xl text-center snap-center 
      ${fadeClass(visible.about )}`}>

        <motion.h1
          className="font-bold font-heptoslab text-[#3E3F29] mb-[50px] text-[125px]"
          initial={{ scale: 1, x: 0, y: 0 }}
          animate={visible.about ? { scale: 0.4, x: 0, y: [-100, -100, -300] } : { scale: 1, x: 0, y: 0 }}
          transition={{duration: 1.5, times: [0.5, 0.5, 1],   ease: "easeInOut"}}>
          ABOUT US
        </motion.h1>

      </section>

{/*----- FOOTER//CONTACTS PAGE-----*/}
      <section ref={(el) => {contactRef.current = el;contact.current = el;}} className={`h-screen bg-[#3E3F29] flex flex-col items-center justify-center text-white text-4xl text-center snap-center 
      ${fadeClass( visible.contact)}`}>

        <motion.h1
          className="font-bold font-heptoslab text-[#BCA88D] mb-[50px] text-[125px]"
          initial={{ scale: 1, x: 0, y: 0 }}
          animate={visible.contact ? { scale: 0.4, x: 0, y: [-100, -100, -300] } : { scale: 1, x: 0, y: 0 }}
          transition={{duration: 1.5, times: [0.5, 0.5, 1],   ease: "easeInOut"}}>
          CONTACTS
        </motion.h1>
      </section>
    </div>

  </div>
  )
}

export default Home