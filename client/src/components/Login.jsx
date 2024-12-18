import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, fetchUser } from '../store/userSlice'
import axios from 'axios'

export default function Login(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState(null)
  const navigate = useNavigate()
  const { data, error, loading } = useSelector((state) => state.user )
  const dispatch = useDispatch()
  
  const handleLogin = async (e) => {
    e.preventDefault()
    setLocalError(null)
   if (username.trim() && password.trim()){
     try {
      const response = await dispatch(loginUser({username, password})).unwrap()
        if (response) {
          navigate("/dashboard")
        }
     } catch (err) {
         console.log(err)
       setLocalError(`server error ${err}`)
     }
    }
    else {
      setLocalError("Invalid credentials")
    }
  }
  
  return (
    <div className="flex flex-col w-[100%] min-h-screen h-full items-center p-6 bg-gray-200">
      <h1 className="font-bold text-5xl mb-2 mt-16">Task<span className="text-blue-600">Track</span></h1>
     <form 
     onSubmit={handleLogin}
     className="flex flex-col gap-2 mt-8">
       <input
       className="px-2 py-4 rounded-md text-center"
       placeholder="Enter username"
       value={username}
       onChange={(e) => setUsername(e.target.value)}
       />
       <input 
       className="px-2 py-4 rounded-md text-center"
       type="password"
       placeholder="Enter your password"
       value={password}
       onChange={(e)=> setPassword(e.target.value)}
       />
       <button type="submit" className="btn bg-blue-600 text-gray-200 font-bold text-xl py-2 px-8 rounded-lg mt-4">{loading ? 'Logging in' : 'Login'}</button>
       
       {localError && <div className="border-2 p-2 text-sm text-center text-red-400 border-red-400 bg-red-50">{localError}</div>}
       <button onClick={() => navigate('/register')}
       className="text-sm text-gray-500">Create an account</button>
     </form> 
     
    </div>
    )
}