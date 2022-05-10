import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/Page404'
import Day from './pages/Day'

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route path="/" element={<Navigate to="/day" />} />
        <Route path="day" element={<Day />}>
          <Route path=":date" element={<Day />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Route>
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
