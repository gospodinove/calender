import { createSlice } from '@reduxjs/toolkit'
import { formatDate } from '../utils/formatters'

const initialState = {
  eventsForDate: {}
}

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    add: (state, action) => {
      const startDate = new Date(action.payload.start)
      const key = formatDate(startDate)

      const oldValue = state[key] ?? []

      state[key] = [...oldValue, action.payload]
    }
  }
})
