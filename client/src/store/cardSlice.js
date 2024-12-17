import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Obtener tarjetas desde el servidor
export const fetchCards = createAsyncThunk('cards/fetchCards', async (listId, thunkApi) => {
  try {
    const token = localStorage.getItem('access');
    const response = await axios.get(`https://tastrack-project.vercel.app/api/cards/?list=${listId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data || 'Error fetching cards');
  }
});

// Agregar tarjeta
export const addCard = createAsyncThunk('cards/addCard', async ({ title, description, list }, thunkApi) => {
  try {
    const token = localStorage.getItem('access');
    const response = await axios.post(
      `https://tastrack-project.vercel.app/api/cards/`,
      { title, description, list },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data || 'Error adding card');
  }
});

export const updateCard = createAsyncThunk('cards/update/card', async ({cardId, updateField}, thunkApi) => {
  try {
    const token = localStorage.getItem("access");
    const response = await axios.patch(
      `https://tastrack-project.vercel.app/api/cards/${cardId}/`,
      updateField, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data || 'Error updating card');
  }
});

// Eliminar tarjeta
export const deleteCard = createAsyncThunk('cards/deleteCard', async (cardId, thunkApi) => {
  try {
    const token = localStorage.getItem('access');
    const response = await axios.delete(`https://tastrack-project.vercel.app/api/cards/${cardId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 204) {
      return cardId;
    }
  } catch (error) {
    console.log('Error :', error)
    return thunkApi.rejectWithValue(error.response?.data || 'Error deleting card');
  }
});

const cardSlice = createSlice({
  name: 'cards',
  initialState: { items: {}, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCards.pending, (state) => { state.loading = true; })
      
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.loading = false;
        const listId = action.meta.arg;
        state.items[listId] = action.payload;
      })
      
      .addCase(fetchCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(addCard.fulfilled, (state, action) => { 
        const { list } = action.payload;
        if (!state.items[list]) {
          state.items[list] = [];
        }
        state.items[list].push(action.payload);
      })
        
      .addCase(addCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(deleteCard.fulfilled, (state, action) => {
        Object.keys(state.items).forEach((listId) => {
          state.items[listId] = state.items[listId].filter((card) => card.id !== action.payload);
        });
      })
      
      .addCase(deleteCard.pending, (state) => {
       state.loading = true;
      })
     
      .addCase(deleteCard.rejected, (state, action) => {
       state.loading = false;
       state.error = action.payload;
       console.log("Error al eliminar la tarjeta", action.payload);
     })
     
     .addCase(updateCard.pending, (state) => {
     state.loading = true;
      })
    .addCase(updateCard.fulfilled, (state, action) => {
     state.loading = false;
     const updatedCard = action.payload;
  
     // Actualiza la tarjeta en el estado
     Object.keys(state.items).forEach((listId) => {
       state.items[listId] = state.items[listId].map((card) =>
        card.id === updatedCard.id ? updatedCard : card
     );
     });
      })
    .addCase(updateCard.rejected, (state, action) => {
      state.loading = false;
        state.error = action.payload;
      });
    }
    });

export default cardSlice.reducer;
