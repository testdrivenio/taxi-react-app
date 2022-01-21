import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { isDriver } from '../services/AuthService';

function Driver (props) {
  if (!isDriver()) {
    return <Navigate to='/' />;
  }

  return <Outlet />;
}

export default Driver;
