import { Button, Grid, IconButton, Typography } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useState } from 'react'
import { formatDate, formatReadableDate } from '../utils/formatters'
import { useNavigate } from 'react-router-dom'
import { addDaysToDate } from '../utils/dates'
import ShareIcon from '@mui/icons-material/Share'
import { useDispatch, useSelector } from 'react-redux'
import { api } from '../utils/api'

const CalendarNavigationBar = ({ data }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const isAuthenticated = useSelector(state => state.auth.user !== undefined)

  const [title, setTitle] = useState()

  useEffect(() => {
    switch (data.type) {
      case 'day':
        setTitle(formatReadableDate(new Date(data.date), true))
        break
      case 'week':
        setTitle(
          formatReadableDate(new Date(data.startDate)) +
            ' - ' +
            formatReadableDate(new Date(data.endDate))
        )
        break
      default:
        break
    }
  }, [data])

  const onSharePress = useCallback(async () => {
    if (!isAuthenticated) {
      dispatch({
        type: 'modals/show',
        payload: { modal: 'auth' }
      })
      return
    }

    const response = await api('shared', 'POST', data)

    if (!response.success) {
      dispatch({
        type: 'modals/show',
        payload: {
          modal: 'toast',
          data: { type: 'error', message: response.messages }
        }
      })
      return
    }

    dispatch({
      type: 'modals/show',
      payload: {
        modal: 'shareSchedule',
        data: { ...data, configId: response.configId }
      }
    })
  }, [dispatch, data, isAuthenticated])

  const onNextPress = useCallback(() => {
    switch (data.type) {
      case 'day':
        navigate('/day/' + formatDate(addDaysToDate(1, new Date(data.date))))
        break
      case 'week':
        navigate(
          '/week/' +
            formatDate(addDaysToDate(7, new Date(data.startDate))) +
            '/' +
            formatDate(addDaysToDate(7, new Date(data.endDate)))
        )
        break
      default:
        break
    }
  }, [data, navigate])

  const onPrevPress = useCallback(() => {
    switch (data.type) {
      case 'day':
        navigate('/day/' + formatDate(addDaysToDate(-1, new Date(data.date))))
        break
      case 'week':
        navigate(
          '/week/' +
            formatDate(addDaysToDate(-7, new Date(data.startDate))) +
            '/' +
            formatDate(addDaysToDate(-7, new Date(data.endDate)))
        )
        break
      default:
        break
    }
  }, [data, navigate])

  return (
    <Grid container spacing={3}>
      <Grid item xs={9} display="flex" alignItems="center">
        <Typography variant="h6">{title}</Typography>
        <Button
          variant="contained"
          endIcon={<ShareIcon />}
          sx={{ ml: 2 }}
          onClick={onSharePress}
        >
          Share
        </Button>
      </Grid>
      <Grid
        item
        xs={3}
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
      >
        <IconButton color="primary" aria-label="next" onClick={onPrevPress}>
          <NavigateBeforeIcon />
        </IconButton>
        <IconButton color="primary" aria-label="prev" onClick={onNextPress}>
          <NavigateNextIcon />
        </IconButton>
      </Grid>
    </Grid>
  )
}

CalendarNavigationBar.propTypes = {
  data: PropTypes.object
}

export default CalendarNavigationBar
