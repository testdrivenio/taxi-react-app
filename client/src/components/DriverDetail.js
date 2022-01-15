import React, { useEffect, useState } from 'react';
import {
  Breadcrumb, Button, Card
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useParams } from 'react-router-dom';

import TripMedia from './TripMedia';
import { getUser } from '../services/AuthService';
import { getTrip, updateTrip } from '../services/TripService';

const createData = (status) => {
  switch (status) {
    case 'REQUESTED':
      return {
        disabled: false,
        message: 'Drive to pick up',
        nextStatus: 'STARTED',
        variant: 'primary'
      };
    case 'STARTED':
      return {
        disabled: false,
        message: 'Drive to drop off',
        nextStatus: 'IN_PROGRESS',
        variant: 'primary'
      };
    case 'IN_PROGRESS':
      return {
        disabled: false,
        message: 'Complete trip',
        nextStatus: 'COMPLETED',
        variant: 'primary'
      };
    default:
      return {
        disabled: true,
        message: 'Completed',
        nextStatus: null,
        variant: 'success'
      };
  }
};

function DriverDetail () {
  const [trip, setTrip] = useState(null);
  const params = useParams();

  useEffect(() => {
    const loadTrip = async (id) => {
      const { response, isError } = await getTrip(id);
      if (isError) {
        setTrip(null);
      } else {
        setTrip(response.data);
      }
    };
    loadTrip(params.id);
  }, [params]);

  const updateTripStatus = (status) => {
    const driver = getUser();
    const updatedTrip = { ...trip, driver, status };
    updateTrip({
      ...updatedTrip,
      driver: updatedTrip.driver.id,
      rider: updatedTrip.rider.id
    });
    setTrip(updatedTrip);
  };

  let data;
  let tripMedia;

  if (trip === null) {
    data = null;
    tripMedia = <>Loading...</>;
  } else {
    data = createData(trip.status);
    tripMedia = (
      <TripMedia
        trip={trip}
        otherGroup='rider'
      />
    );
  }

  return (
    <>
      <Breadcrumb>
        <LinkContainer to='/driver'>
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active>Trip</Breadcrumb.Item>
      </Breadcrumb>
      <Card className='mb-3' data-cy='trip-card'>
        <Card.Header>Trip</Card.Header>
        <Card.Body>{tripMedia}</Card.Body>
        {
          trip !== null && (
            <Card.Footer>
              <div className='d-grid'>
                <Button
                  data-cy='status-button'
                  disabled={data.disabled}
                  variant={data.variant}
                  onClick={() => updateTripStatus(data.nextStatus)}
                >{data.message}
                </Button>
              </div>
            </Card.Footer>
          )
        }
      </Card>
    </>
  );
}

export default DriverDetail;
