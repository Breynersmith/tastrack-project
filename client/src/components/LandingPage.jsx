import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import './landingpage.css'


export default function LandingPage(){
  const navigate = useNavigate()
  
  const handleRegister = () => {
    navigate('/register')
  }
  const handleLogin = () => {
    navigate('/login')
  }
  
  return (
    <div className="flex flex-col justify-between h-[100%] items-center text-center p-6 bg-gray-200">
      <header className="">
        <h1 className="font-bold text-5xl mb-2 mt-8 title-expand">Task<span className="text-blue-600">Track</span></h1>

      </header>
      <section className="font-medium text-xl">
            <p >Organize your tasks easily and efficiently</p>
          <p>Collaborate in real time with your team</p>
          <p>Assign tasks and track progress</p>
          <p>And much more...</p>
        
      </section>
      <div className="m-16 flex flex-col gap-4">
        <button onClick={handleRegister} className="btn bg-blue-600 text-gray-200 font-bold text-xl py-4 px-6 rounded-lg">Register</button>
        
         <button onClick={handleLogin} className="btn  bg-blue-600 text-gray-200 font-bold text-xl py-4 px-6 rounded-lg">Log in</button>
        

      </div>
    </div>
    )
}