import { configureStore } from '@reduxjs/toolkit'
import cardsReducer from './cardSlice'
import listsReducer from './listsSlice'
import boardsReducer from './boardsSlice'
import userReducer from './userSlice'

const store = configureStore({
  reducer : {
    user : userReducer,
    cards : cardsReducer,
    lists : listsReducer,
    boards : boardsReducer
  }
})

export default store