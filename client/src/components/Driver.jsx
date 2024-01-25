import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { isDriver } from '../services/AuthService.js'

export default function Driver (props) {
  if (!isDriver()) {
    return <Navigate to='/' />
  }

  return <Outlet />
}
