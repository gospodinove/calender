import { Stack, Typography } from '@mui/material'
import TimerIcon from '@mui/icons-material/Timer'

export default function ComingSoon() {
  return (
    <Stack alignItems="center" spacing={1}>
      <TimerIcon fontSize="large" />
      <Typography variant="h5">Coming soon!</Typography>
    </Stack>
  )
}
