import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <ToastContainer
  position="top-right"
  autoClose={4000}
  toastClassName="!bg-black !text-white !rounded-xl !shadow-lg"
  closeButton={false}
/>
  </StrictMode>,
)
