import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { authSlice } from './authSlice'

export const slices = {
  auth: authSlice
}

const reducers = Object.values(slices).reduce((acc, slice) => {
  acc[slice.name] = slice.reducer
  return acc
}, {})

export const reducer = combineReducers(reducers)

const store = configureStore({ reducer })

export default store
