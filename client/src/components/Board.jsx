import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import {fetchBoards, addBoard, deleteBoard, setSelectedBoard, sharedBoard } from '../store/boardsSlice'
import axios from 'axios'

export default function Board({userId}){
  const dispatch = useDispatch()
  const { items, loading, error } = useSelector((state) => state.boards)
  const [name, setName] = useState("")
  const [showMenu, setShowMenu ] = useState(null)
  const [shared, setShared] = useState(null)
  const handleShowBoard = () => {
  setButtonAddBoard(!buttonAddBoard)
  }
  
 const handleSelectedBoard = (board) => {
    dispatch(setSelectedBoard(board))
  }
  

 const handleAddBoard = (e) => {
    e.preventDefault()
    if (name.trim() === ''){
     return
    } else {
    dispatch(addBoard({ name, created_by: userId }))
    setName('') 
    }
    
  }
  
const handleDeleteBoard = async (boardId) => {
  await dispatch(deleteBoard(boardId))
  setShowMenu(null)
  
  dispatch(fetchBoards())
}

const handleShared = () => {
  setShowMenu(null)
}

//funcion para compartir el tablero
const [emailUser, setEmailUser] = useState("")
const [messageSuccess, setMessageSuccess] = useState("")
const [messageError, setMessageError] = useState("")

const handleSharedBoard = (e, boardId) => {
  e.preventDefault()
  setShowMenu(null)
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailUser.trim() || !regexEmail.test(emailUser) || error) {
    setMessageError("Please insert valid email")
    setTimeout(()=>{
     setMessageError("") 
    },5000)
    return
  }
  
    dispatch(sharedBoard({boardId, email: emailUser}))
    setEmailUser("")
    setMessageSuccess("Board successfully shared")
    setTimeout(()=>{
      setEmailUser("")
      setMessageSuccess("")
    }, 5000)
    
  
}


useEffect(() => {
 dispatch(fetchBoards())
  }, [dispatch]);
  
  return (
    <div className="w-full">
     
      <div className=" flex justufy-center w-full">
        <form className="flex flex-col justufy-center w-[90%] mx-auto gap-2" onSubmit={handleAddBoard}>
          <input type="text"
          value={name}
          className="rounded-lg px-1 py-1 text-center  border-none  text-sm"
          placeholder="Enter Name Board"
          onChange={(e) => setName(e.target.value)}
          />
          <button className="bg-gray-300 rounded-md text-black font-medium" type="submit">
           Add Board
          </button>
       </form>
    </div>
    
      {!items ? (<div className="border-2 border-purple-500 rounded-lg p-6 text-purple-500 bg-purple-100 flex flex-col h-full justify-center items-center">
   
         <button  className="border-b-2 border-purple-500 font-bold mt-2" >Agrega uno
         </button>
         </div>) : (
         <div className="pt-4 text-center h-full">
           <h2 className="font-bold text-gray-300 uppercase">
             Boards
           </h2>
           <div className="">
             {items.map((board, index ) => (
             <div key={board.id} className="py-2 font-medium flex justify-between relative text-gray-300 ">
               <button 
               type="button"
               onClick={()=> handleSelectedBoard(board)}>
               {board.name}
               </button>
             <button 
             type="button"
             onClick={() => setShowMenu(showMenu === index ? null : index)}
             >
             <i className="text-gray-100 text-lg font-bold fa-solid fa-ellipsis"></i>
             </button>
          <div className={`${showMenu === index ? '' : 'hidden' } flex flex-col py-2 rounded-lg gap-2 bg-gray-200 absolute z-10 right-6 top-8` }>
            
            <button
             type="button"
             onClick={() => setShared(shared === index ? null : index)}
             className="text-gray-600 bg-gray-50 p-1">
               Compartir
             </button>
             <button
             type="button"
             className="text-gray-600 bg-gray-50 p-1">
               Renombrar
             </button>
             <button
             type="button"
             className="text-gray-600 bg-gray-50 p-1"
             onClick={() => handleDeleteBoard(board.id)} >
               Eliminar 
             </button>
              
          </div>
          
          {shared === index && <div className={`${shared === index ? '': 'hidden'} z-20 bg-gray-200 px-2 pt-6 rounded-md shadow-xl absolute left-[22%]`}>

            <form onSubmit={(e) => handleSharedBoard(e, board.id)}>
              <input 
              type="text"
              className="text-center text-black p-2 rounded-md"
              placeholder="Enter Email or Username"
              value={emailUser}
              onChange={(e) => setEmailUser(e.target.value)}
              />
              <div>
                {messageSuccess && <p className="text-green-500 text-sm font-medium">{messageSuccess}</p>}
            {messageError && <p className="text-red-500 text-sm font-medium">{messageError}</p>}
              </div>
              <button
              className="m-2 text-gray-600"
              type="submit"
              >Send</button>
             <button 
            className="m-2 text-red-500"
            type="button" 
            onClick={()=> setShared(null)}>
              Cancel
            </button>
            </form>
            
          </div>}
           </div>
             ))}
           </div>
         </div>)}

    </div>
    )
}
    