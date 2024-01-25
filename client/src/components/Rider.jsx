import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { isRider } from '../services/AuthService.js'

export default function Rider (props) {
  if (!isRider()) {
    return <Navigate to='/' />
  }

  return <Outlet />
}
