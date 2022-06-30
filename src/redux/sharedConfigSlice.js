import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  owner: undefined,
  config: undefined,
  events: [],
  freeSlots: [],
  shouldFetch: true
}

export const sharedConfigSlice = createSlice({
  name: 'sharedConfig',
  initialState,
  reducers: {
    set: (_, action) => action.payload,
    setShouldFetch: (state, action) => {
      state.shouldFetch = action.payload
    }
  }
})
