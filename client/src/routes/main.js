import React, {useState, useEffect} from 'react'

function Main() {
const [User, Setuser] = useState("");
const [Pass, SetPass] = useState("");


  return (
    <>
        <form>
            <h1 className='text-7xl text-center text-blue-400'>LOGIN SYSTEM</h1>
            <input className='bg-#23423 rounded' value={User} placeholder='Enter Username' onChange={e => Setuser(e.target.value)}/>
            <input value={Pass} placeholder='Enter Password' onChange={e => SetPass(e.target.value)}/>
            <button>LOGIN</button>
            <h1>MESSAGE</h1>

        </form>
    </>
  )
}

export default Main 