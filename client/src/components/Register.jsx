import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signupUser } from '../store/userSlice'

export default function Register(){
  const [username, setUsername ] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const { data, loading, error } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const handleRegister = async (e) => {
    e.preventDefault()
    const register = await dispatch(signupUser({username, email, password}))
    if (register){
        navigate("/login")
    }
  }
  return (
    <div className="flex flex-col w-[100%] h-full justify-center items-center p-8 bg-gray-200">
      <h1 className="font-bold text-5xl mb-2">Task<span className="text-blue-600">Track</span></h1>
      <form 
      onSubmit={handleRegister}
      className="pt-16 flex flex-col gap-2 w-[80%] text-center">
     
      <input
      className="px-2 py-4 rounded-md text-center"
      placeholder="Enter username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      />
      <input 
      className="px-2 py-4 rounded-md text-center"
      placeholder="Enter email"
      value={email}
      onChange={(e)=> setEmail(e.target.value)}
      />
      <input
      type='password'
      className="px-2 py-4 rounded-md text-center"
      placeholder="Enter password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" className="btn bg-blue-600 text-white font-bold text-xl py-2 px-8 rounded-lg">{loading ? 'Signing up...' : 'Register'}</button>
      </form>
      <p className="px-8 text-xs text-gray-400 font-medium text-center mt-1">Al registrarme acepto las condiciones del servicio y su politica de privacidad</p>
      
    </div>
    )  
}