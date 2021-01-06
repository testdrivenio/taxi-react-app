import React, { useEffect, useState } from 'react';
import {
  Breadcrumb, Button, Card, Col, Row
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import TripMedia from './TripMedia';
import { getUser } from '../services/AuthService';
import { getTrip, updateTrip } from '../services/TripService';

function DriverDetail ({ match }) {
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    const loadTrip = async (id) => {
      const { response, isError } = await getTrip(id);
      if (isError) {
        setTrip(null);
      } else {
        setTrip(response.data);
      }
    }
    loadTrip(match.params.id);
  }, [match]);

  const updateTripStatus = (status) => {
    const driver = getUser();
    const updatedTrip = {...trip, driver, status};
    updateTrip({
      ...updatedTrip,
      driver: updatedTrip.driver.id,
      rider: updatedTrip.rider.id
    });
    setTrip(updatedTrip);
  };

  let tripMedia;

  if (trip === null) {
    tripMedia = <>Loading...</>;
  } else {
    tripMedia = (
      <TripMedia
        trip={trip}
        otherGroup='rider'
      />
    )
  }

  return (
    <Row>
      <Col lg={12}>
        <Breadcrumb>
          <LinkContainer to='/driver'>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          </LinkContainer>
          <Breadcrumb.Item active>Trip</Breadcrumb.Item>
        </Breadcrumb>
        <Card className='mb-3' data-cy='trip-card'>
          <Card.Header>Trip</Card.Header>
          <Card.Body>{tripMedia}</Card.Body>
          <Card.Footer>
            {
              trip !== null && trip.status === 'REQUESTED' && (
                <Button
                  data-cy='status-button'
                  block
                  variant='primary'
                  onClick={() => updateTripStatus('STARTED')}
                >Drive to pick up
                </Button>
              )
            }
            {
              trip !== null && trip.status === 'STARTED' && (
                <Button
                  data-cy='status-button'
                  block
                  variant='primary'
                  onClick={() => updateTripStatus('IN_PROGRESS')}
                >Drive to drop off
                </Button>
              )
            }
            {
              trip !== null && trip.status === 'IN_PROGRESS' && (
                <Button
                  data-cy='status-button'
                  block
                  variant='primary'
                  onClick={() => updateTripStatus('COMPLETED')}
                >Complete trip
                </Button>
              )
            }
            {
              trip !== null && !['REQUESTED', 'STARTED', 'IN_PROGRESS'].includes(trip.status) && (
                <span className='text-center'>Completed</span>
              )
            }
          </Card.Footer>
        </Card>
      </Col>
    </Row>
  );
}

export default DriverDetail;
