import React from 'react'
import { RouterProvider } from 'react-router-dom'
import router from './routes'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
const theme = createTheme({
  palette: {
    background: {
      default: '#bbbab4',
     },
  },});
export default function App() {
  const queryClient = new QueryClient()

  return (
    <>
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
    </>
  )
}
