import { createSlice } from '@reduxjs/toolkit'
import { formatDate } from '../utils/formatters'

const initialState = {
  createEventModalData: null,
  eventsForDate: {}
}

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    add: (state, action) => {
      state[formatDate(action.payload.start)] = action.payload
    }
  }
})
