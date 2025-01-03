import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'


export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, {rejectWithValue}) =>{
    try {
      const token = localStorage.getItem('access')
      const response = await axios.get(`https://tastrack-project.vercel.app/auth/users/me/`, {
        headers : {
          Authorization : `Bearer ${token}`
        }
      })
        return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  })

export const loginUser = createAsyncThunk("user/loginUser", async ({username, password}, thunkApi) => {
  try {
      
    const response = await axios.post(`https://tastrack-project.vercel.app/auth/jwt/create/`, {
      username,
      password
    }, {
      'headers' : {
        "Content-type" : "application/json"
      }
    })
    if (response.status === 200){
      localStorage.setItem("access", response.data.access)
      return response.data
    }
  } catch (error) {
    return thunkApi.rejectWithValue(error.response.data)
  }
}
  ) 
  
export const signupUser = createAsyncThunk(
    "user/signupUser", async ({ username, email, password }, thunkApi) => {
    try {
        const response = await axios.post('https://tastrack-project.vercel.app/auth/users/', {
        username,
        email,
        password
      }, {
        headers: {
      'Content-Type': 'application/json'
    },
      })
     if (response.status === 201) {
       return response.data
     } 
        } catch (error) {
            return thunkApi.rejectWithValue(error.response?.data || "unexpected error")
        }
    })
 
  const userSlice = createSlice({
    name: 'user',
    initialState : {
      data: null,
      loading: false,
      error : null
    },
    reducers : {
      logoutUser(state){
        localStorage.removeItem('access')
        state.data = null
      }
    },
    extraReducers :(builder) => {
      builder
         .addCase(loginUser.pending, (state)=>{
           state.loading = true
           state.error = null
         })
         .addCase(loginUser.fulfilled, (state, action) => {
           state.loading = false
           state.error = null
           state.data = action.payload
         })
         .addCase(loginUser.rejected, (state, action) => {
           state.loading = false
           state.error = action.payload
         })
         .addCase(fetchUser.pending, (state) => {
           state.loading = true
           state.error = null
         })
         .addCase(fetchUser.fulfilled, (state, action) => {
           state.data = action.payload
           state.loading = false
           state.error = null
         })
         .addCase(fetchUser.rejected, (state, action) => {
           state.loading = false
           state.error = action.payload
         })
         .addCase(signupUser.fulfilled, (state, action) => {
             state.data = action.payload
             state.loading = false
             state.error = null
         })
         .addCase(signupUser.pending, (state) => {
             state.loading = true
             state.error = null
         })
         .addCase(signupUser.rejected, (state, action) => {
             state.loading = false
             state.error = action.payload
         })
    }
  })
  
  
  export const { logoutUser } = userSlice.actions
  export default userSlice.reducer