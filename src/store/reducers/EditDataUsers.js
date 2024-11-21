// store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  error: '',
  loading: false,
  success: false,
};

export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/register', userData);
    return response.data; // Возвращаем данные из ответа сервера
  } catch (error) {
    return rejectWithValue(error.response.data); // Возвращаем ошибку, если запрос не удался
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setConfirmPassword: (state, action) => {
      state.confirmPassword = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = ''; // Очищаем ошибку при новом запросе
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = ''; // Сброс ошибки при успешной регистрации
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка при регистрации';
      });
  },
});

export const { setPhoneNumber, setPassword, setConfirmPassword, setError, clearError } = authSlice.actions;
export default authSlice.reducer;
