import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: undefined
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken: (store, action) => {
      store.token = action.payload
    }
  }
})
