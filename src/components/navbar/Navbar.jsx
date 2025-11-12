import React from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import style from './Navbar.module.css'
export default function Navbar() {
  return (
    <>
      <Box sx={{ flexGrow: 1, zIndex: 9999 }}>
        <AppBar position="sticky" sx={{ zIndex: 9999999 }} >
          <Toolbar className={style.NavList} >
            <Typography className={style.NavMenu} component={'dev'}>
              <Link component={RouterLink} to={'/'} underline='none' color='inherit'>Home</Link>
              <Link component={RouterLink} to={'/cart'} underline='none' color='inherit'>Cart</Link>
              <Link component={RouterLink} to={'/profile'} underline='none' color='inherit'>Profile</Link>


            </Typography>
            <Typography className={style.NavAuth} component={'dev'}>
              <Button
                variant="contained"
                component={RouterLink}
                to="/login"
              >
                Login
              </Button>

              <Button
                variant="contained"
                component={RouterLink}
                to="/register"
              >
                Register
              </Button>

            </Typography>

          </Toolbar>
        </AppBar>
      </Box>
    </>
  )
}


