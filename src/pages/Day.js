import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { formatDate } from '../utils/formatters'

export default function Day() {
  const navigate = useNavigate()
  const params = useParams()

  useEffect(() => {
    // redirect happens here because it causes infinite loop in routes.js
    if (!params.date) {
      navigate('/day/' + formatDate(new Date()))
    }
  })

  return <div>{params.date}</div>
}
