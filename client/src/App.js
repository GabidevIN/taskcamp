import React, { useEffect, useState} from 'react'

function App() {
  const [datas,setdata] = useState('')

  useEffect(() => {
    fetch("/api").then(
      response => response.json()
    ).then(
      data => {
        setdata(data)
      }
    )
  })


  return (
    <>
    {(typeof datas.users === 'undefined') ? (
      <p>Loading...</p>
    ) : (
      datas.users.map((user,i) =>(
        <p key={i}>{user}</p>)
      )
    )}



    </>
  )
}



export default App