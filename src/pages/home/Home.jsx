import { Container, Typography } from '@mui/material'
import style from './Home.module.css'
import React from 'react'
import Categories from '../categories/Categories'

export default function Home() {
  return (
    <>
      <div className={style.HeaderImage}></div>
              <Container maxWidth='lg'>
                        <Categories />
        <Typography href='#' component={'a'} variant='subtitle2'>Click</Typography>
              </Container>

    </>
  )
}
