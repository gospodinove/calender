import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: undefined
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    updatePrefs: (state, action) => {
      state.user = { ...state.user, preferences: action.payload }
    }
  }
})
