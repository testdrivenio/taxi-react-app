import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import DriverDashboard from './DriverDashboard';
import DriverDetail from './DriverDetail';
import { isDriver } from '../services/AuthService';

function Driver (props) {
  if (!isDriver()) {
    return <Redirect to='/' />
  }

  return (
    <Switch>
      <Route path='/driver/:id' component={DriverDetail} />
      <Route component={DriverDashboard} />
    </Switch>
  );
}

export default Driver;
