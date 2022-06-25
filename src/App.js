import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/Page404'
import Day from './pages/Day'
import List from './pages/List'
import Week from './pages/Week'
import { useDispatch } from 'react-redux'
import { useCallback, useEffect } from 'react'
import { api } from './utils/api'
import { isEmptyObject } from './utils/objects'
import { cleanEventData } from './utils/events'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    async function checkLoggedIn() {
      const user = await api('session-user')

      if (user && !isEmptyObject(user)) {
        dispatch({ type: 'auth/setUser', payload: user })
      }
    }

    checkLoggedIn()
  }, [dispatch])

  const onTimeSelected = useCallback(
    eventData => {
      dispatch({
        type: 'modals/show',
        payload: { modal: 'createEvent', data: cleanEventData(eventData) }
      })
    },
    [dispatch]
  )

  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route path="/" element={<Navigate to="/day" />} />
        <Route path="day" element={<Day onTimeSelected={onTimeSelected} />} />
        <Route path="week" element={<Week onTimeSelected={onTimeSelected} />} />
        <Route path="list" element={<List />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Route>
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

export default App
