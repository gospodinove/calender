import { createSlice } from '@reduxjs/toolkit'

// modal name => data
const initialState = {}

export const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    show: (state, action) => {
      const modalState = { open: true }

      if (action.payload.data) {
        modalState.data = action.payload.data
      }

      state[action.payload.modal] = modalState
    },
    hide: (state, action) => {
      state[action.payload.modal] = undefined
    }
  }
})
