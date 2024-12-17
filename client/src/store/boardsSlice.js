import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'


export const fetchBoards = createAsyncThunk(
  'boards/fetchBoards',
  async (userId, thunkApi) => {
    try {
      const token = localStorage.getItem('access')
      const response = await axios.get(`https://tastrack-project.vercel.app/api/boards/?user=${userId}`,{
        headers : {
          Authorization : `Bearer ${token}`
        }
      })
      if (response.status === 200){
        return response.data
      }
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data)
    }
  })
  
export const addBoard = createAsyncThunk(
    'boards/addBoard',
    async ({name, created_by}, thunkApi) => {
      try {
        const token = localStorage.getItem('access')
        const response = await axios.post(`https://tastrack-project.vercel.app/api/boards/?user=${created_by}/`,{
          name,
          created_by 
        }, {
        headers : {
          Authorization : `Bearer ${token}`
        }
        })
        if (response.status === 201) {
          console.log(response.data)
          return response.data
        }
      } catch (error) {
        return thunkApi.rejectWithValue(error.response.data)
      }
    }
    )
    
  
export const deleteBoard = createAsyncThunk(
    'boards/deleteBoard',
    async (boardId, thunkApi) => {
      try {
        const token = localStorage.getItem('access')
        const response = await axios.delete(`https://tastrack-project.vercel.app/api/boards/${boardId}`, {
          headers : {
            Authorization :`Bearer ${token}`
          }
        })
        if (response.status === 204){
          return boardId
        }
      } catch (error) {
        return thunkApi.rejectWithValue(error.response.data)
      }
    })

export const sharedBoard = createAsyncThunk(
  'boards/sharedBoard', async ({boardId, email}, thunkApi) => {
    try {
      const token = localStorage.getItem("access")
      const response = axios.post(`https://tastrack-project.vercel.app/api/boards/${boardId}/share/`,
      { email }, {
        headers : {
          Authorization : `Bearer ${token}`
        }
      })
      if (response.status === 200){
        return { boardId, email }
      }
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data)
    }
  }
  )   
  
  const boardSlice = createSlice(
    {
      name: 'boards',
      initialState : {
        items : [],
        loading : false,
        error : null,
        selectedBoard : null
      },
      reducers : {
        setSelectedBoard(state, action){
          state.selectedBoard = action.payload
        }
      },
      extraReducers : (builder) => {
        builder
          .addCase(fetchBoards.pending, (state) => {
            state.loading = true
          })
          .addCase(fetchBoards.fulfilled, (state, action) =>{
            state.loading = false
            state.items = action.payload
          })
          .addCase(fetchBoards.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
          })
          .addCase(addBoard.fulfilled, (state, action) => {
            state.items.push(action.payload)
          })
          .addCase(deleteBoard.fulfilled, (state, action) => {
            state.items = state.items.filter(board => board.id !== action.payload)
          })
          .addCase(sharedBoard.fulfilled, (state, action) => {
            const {boardId, email} = action.payload
            const board = state.items.find((board) => board.id === boardId)
            if (board){
              board.sharedWhit = [...(board.sharedWhit || []), email]
            }
          })
          .addCase(sharedBoard.rejected, (state, action)=>{
            state.error = action.payload
          })
      }
    })
    export const {setSelectedBoard} = boardSlice.actions
    export default boardSlice.reducer