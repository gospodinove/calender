import { createSlice } from '@reduxjs/toolkit'

// modal name => data
const initialState = {}

export const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    show: (state, action) => {
      const modalState = { open: true }

      if (!action.payload.data) {
        return
      }

      modalState.data = action.payload.data

      state[action.payload.modal] = modalState
    },
    hide: (state, action) => {
      console.log(action.payload)
      state[action.payload.modal] = undefined
    }
  }
})
