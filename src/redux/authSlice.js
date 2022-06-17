import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isAuthModalOpen: false,
  user: undefined
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    showAuthModal: state => {
      state.isAuthModalOpen = true
    },
    hideAuthModal: state => {
      state.isAuthModalOpen = false
    }
  }
})
