import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchLists = createAsyncThunk(
  'lists/fetchLists',
  async (boardId, thunkApi) => {
    try {
      const token = localStorage.getItem('access')
      const response = await axios.get(`http://localhost:8000/api/lists/?board_id=${boardId}`,{
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
  
export const addList = createAsyncThunk(
    'lists/addList',
    async ({name, board}, thunkApi) => {
      try {
        const token = localStorage.getItem('access')
        const response = await axios.post(`http://localhost:8000/api/lists/?board_id=${board}`,{
          name,
          board 
        }, {
        headers : {
          Authorization : `Bearer ${token}`
        }
        })
        if (response.status === 201) {
          return response.data
        }
      } catch (error) {
        return thunkApi.rejectWithValue(error.response.data)
      }
    }
    )
    
export const deleteList = createAsyncThunk(
    'lists/deleteList',
    async (listId, thunkApi) => {
      try {
        const token = localStorage.getItem('access')
        const response = await axios.delete(`http://localhost:8000/api/lists/${listId}`, {
          headers : {
            Authorization :`Bearer ${token}`
          }
        })
        if (response.status === 204){
          return listId
        }
      } catch (error) {
        return thunkApi.rejectWithValue(error.response.data)
      }
    })

export const updateList = (
  createAsyncThunk(
    "lists/updateList", async ({listId, name}, thunkApi) => {
      try {
       const token = localStorage.getItem("access")
       const response = await axios.patch(`http://localhost:8000/api/lists/${listId}/`, {
         name
       }, {
         headers : {
           Authorization: `Bearer ${token}`
         }
       })
       if (response.status === 200){
         return response.data
       }
      } catch (error) {
        return thunkApi.rejectWithValue(error.response?.data || 'Error Desconocido')
      }
    }))    
  
  const listSlice = createSlice(
    {
      name: 'lists',
      initialState : {
        items : [],
        loading : false,
        error : null
      },
      reducers : {},
      extraReducers : (builder) => {
        builder
          .addCase(fetchLists.pending, (state) => {
            state.loading = true
          })
          .addCase(fetchLists.fulfilled, (state, action) =>{
            state.loading = false
            state.items = action.payload
          })
          .addCase(fetchLists.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
          })
          .addCase(addList.fulfilled, (state, action) => {
            state.items.push(action.payload)
          })
          .addCase(deleteList.fulfilled, (state, action) => {
            state.items = state.items.filter(list => list.id !== action.payload)
          })
          .addCase(updateList.pending, (state) =>{
            state.loading = true
          })
          .addCase(updateList.fulfilled, (state, action) =>{
            state.loading = false
            state.error = null
            state.items = state.items.map(lists => lists.id === action.payload.id ? action.payload : lists )
          })
          .addCase(updateList.rejected, (state, action) => {
          	state.loading = false
          	state.error = action.payload
          })
      }
    })
    
    export default listSlice.reducer