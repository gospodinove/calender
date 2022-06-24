import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { authSlice } from './authSlice'
import { eventsSlice } from './eventsSlice'
import { modalsSlice } from './modalsSlice'

export const slices = {
  auth: authSlice,
  events: eventsSlice,
  modals: modalsSlice
}

const reducers = Object.values(slices).reduce((acc, slice) => {
  acc[slice.name] = slice.reducer
  return acc
}, {})

export const reducer = combineReducers(reducers)

const store = configureStore({ reducer })

export default store
