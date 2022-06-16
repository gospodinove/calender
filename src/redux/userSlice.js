import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: undefined
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    set: (store, action) => {
      store.user = action.payload
    }
  }
})
