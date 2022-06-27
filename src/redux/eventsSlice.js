import { createSlice } from '@reduxjs/toolkit'

const initialState = []

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    add: (state, action) => {
      const loadedEventIds = state.map(e => e.id)
      const newEvents = action.payload.filter(
        e => !loadedEventIds.includes(e.id)
      )

      return [...state, ...newEvents]
    }
  }
})
