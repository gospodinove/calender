import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
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
import { formatDate } from './utils/formatters'
import { getWeekBoundsForDate } from './utils/dates'
import Shared from './pages/Shared'
import MainLayout from './layouts/MainLayout'

function App() {
  const dispatch = useDispatch()

  const checkLoggedIn = useCallback(async () => {
    try {
      const user = await api('session-user')

      if (user && !isEmptyObject(user)) {
        dispatch({ type: 'auth/setUser', payload: user })
      }
    } catch (err) {
      console.log(err)
    }
  }, [dispatch])

  useEffect(() => {
    checkLoggedIn()
  }, [checkLoggedIn])

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="day/:date" element={<Day />} />
        <Route path="week/:startDate/:endDate" element={<Week />} />
        <Route path="list" element={<List />} />

        <Route path="shared/:configId" element={<Shared />} />

        {/* Auth */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route path="404" element={<NotFound />} />

        <Route path="*" element={<Navigate to="/404" />} />

        {/* Redirects */}
        <Route
          path="/"
          element={<Navigate to={`/day/${formatDate(new Date())}`} />}
        />
        <Route
          path="day"
          element={<Navigate to={`/day/${formatDate(new Date())}`} />}
        />
        <Route
          path="week"
          element={
            <Navigate
              to={`/week/${getWeekBoundsForDate(new Date())
                .map(d => formatDate(d))
                .join('/')}`}
            />
          }
        />
      </Route>
    </Routes>
  )
}

export default App
