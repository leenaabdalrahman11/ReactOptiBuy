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

export default function App() {
  const queryClient = new QueryClient()


  return (
    <>
    
    
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />

    </QueryClientProvider>
    </>
  )
}
