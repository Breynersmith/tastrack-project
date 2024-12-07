import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser, logoutUser } from '../store/userSlice'
import axios from 'axios'
import Board from './Board'
import Lists from './Lists'
import './Dashboard.css'



export default function Dashboard(){
  const dispatch = useDispatch()
  const { data, loading, error } = useSelector((state) => state.user)
  const selectedBoard  = useSelector((state) => state.boards.selectedBoard)
  const navigate = useNavigate()
  
  const [buttonAddBoard, setButtonAddBoard] = useState(false)
  const [showMenuProfile, setShowMenuProfile] = useState(false)
  const [name, setName] = useState("")
  const [showSide, setShowSide] = useState(false)
  const [animationPulse, setAnimationPulse] = useState(false)
  
 
  const handleShowSide = () => {
    setShowSide(!showSide)
  }
  
  
  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/login')
  }
  
 useEffect(() => {
    const token = localStorage.getItem('access');
    const getUser = async () => {
      const response = await dispatch(fetchUser())
      if (response){
        setName(response.payload.username)
        console.log(response.payload.code)
        } 
       if (response.payload.code === 'token_not_valid'){
         dispatch(logoutUser())
         navigate('/login')
       }
       }
       getUser()
  },[dispatch, navigate]
  )

useEffect(()=>{
  if(selectedBoard){
    setShowSide(false)
    setAnimationPulse(false)
  } else {
    setAnimationPulse(true)
  }
},[selectedBoard])  
 
  return (
    <div className="w-full h-full z-[999]">
      <div className="pt-2 px-2 flex gap-4 justify-between bg-gray-300">
        <div className="flex gap-4">
           <h1 className="font-bold text-2xl mb-2 relative tracking-tight">T<span className="text-blue-600 absolute mt-[-5px] ml-[-5px]">T</span></h1>
           
          <h1 className="font-bold text-xl mb-2 ">Task<span className="text-blue-600">Track</span></h1>
         
        </div>
    
       
        <div className="relative z-[999]">
       <button className="w-8 h-8 border-4 border-blue-600 rounded-full flex justify-center items-center bg-white"
       onClick={()=>{setShowMenuProfile(!showMenuProfile)}}>
         {name && <p className="text-blue-600 font-bold text-xl">{name.charAt(0) || '...'}</p>}
          
        </button> 
        {showMenuProfile && <div className="p-2 rounded-lg absolute right-6 top-6 w-36 bg-white text-blue-600 font-medium flex justify-center z-60 shadow-3xl">
          <button 
          className="z-[999]"
          onClick={handleLogout}>
            Log out
          </button>
        </div>}
       </div>
         
      </div>
      <div className="flex w-full h-full  relative">
        
        <div className={`${showSide ? 'sideActive' : 'sideInactive'}  w-[70%] px-2 pt-4  bg-blue-600 h-full z-50`}>
          <button 
          onClick={handleShowSide}
          className={`${animationPulse  ? 'pulse' : ''} bg-gray-200 absolute -right-4 top-2 w-8 h-8 rounded-full border-2 border-black`}>{!showSide ? (<i className="fa-solid fa-angles-right"></i>) : (<i className="fa-solid fa-angles-left"></i>)}
          </button>
          
        {data && <Board userId={data.id}/>}
          
        </div>

       <div className="w-full h-full">
         {selectedBoard ? (<div className="h-full overflow-y-scroll pb-16">
          <div className=" bg-blue-600 p-4 text-right font-bold uppercase w-full fixed border-b-4 border-blue-600 text-gray-300 z-40">
            {selectedBoard.name}
          </div>
        <div className="mt-16 overflow-y-scroll">
           <Lists boardId={selectedBoard.id} />
        </div>
         </div>): (<div className=" mt-32 text-xl text-center">
           <p>Welcome <span className="text-2xl text-blue-600">{name}</span></p>
           <p>Select Board to Get Started</p>
         </div>)}
         
       </div>
      </div>
    </div>
    )
}
