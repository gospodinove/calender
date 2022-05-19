import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { userSlice } from './userSlice'

export const slices = {
  user: userSlice
}

const reducers = Object.values(slices).reduce((acc, slice) => {
  acc[slice.name] = slice.reducer
  return acc
}, {})

export const reducer = combineReducers(reducers)

const store = configureStore({ reducer })

export default store
