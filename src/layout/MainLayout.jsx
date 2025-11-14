import React from 'react'
import Navbar from '../components/navbar/Navbar'
import Footer from '../components/footer/Footer'
import { Outlet, useLocation } from 'react-router-dom'
import { Container } from '@mui/material'

export default function MainLayout() {
    const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '/home';

  return (
    <>

        <Navbar />
        {isHome ? <Outlet /> : <Container maxWidth="lg"><Outlet /></Container>}

        <Footer />
    </>
  )
}
