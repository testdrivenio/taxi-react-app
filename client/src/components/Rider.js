import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { isRider } from '../services/AuthService';

function Rider (props) {
  if (!isRider()) {
    return <Navigate to='/' />;
  }

  return <Outlet />;
}

export default Rider;
