import { Typography } from '@mui/material'
import style from './Home.module.css'
import React from 'react'

export default function Home() {
  return (
    <div>
        <Typography  component={'h1'} variant='body1'>Hello </Typography>
        <Typography component={'p'} variant='subtitle1'>this is home</Typography>
        <Typography href='#' component={'a'} variant='subtitle2'>Click</Typography>
    </div>
  )
}
