import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  owner: undefined,
  config: undefined,
  events: [],
  freeSlots: []
}

export const sharedConfigSlice = createSlice({
  name: 'sharedConfig',
  initialState,
  reducers: {
    set: (_, action) => action.payload
  }
})
