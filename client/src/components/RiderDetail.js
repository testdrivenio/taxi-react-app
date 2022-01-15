import React, { useEffect, useState } from 'react';
import { Breadcrumb, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useParams } from 'react-router-dom';

import TripMedia from './TripMedia';
import { getTrip } from '../services/TripService';

function RiderDetail ({ match }) {
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

  let tripMedia;

  if (trip === null) {
    tripMedia = <>Loading...</>;
  } else {
    tripMedia = (
      <TripMedia
        trip={trip}
        otherGroup='driver'
      />
    );
  }

  return (
    <>
      <Breadcrumb>
        <LinkContainer to='/rider'>
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active>Trip</Breadcrumb.Item>
      </Breadcrumb>
      <Card className='mb-3' data-cy='trip-card'>
        <Card.Header>Trip</Card.Header>
        <Card.Body>{tripMedia}</Card.Body>
      </Card>
    </>
  );
}

export default RiderDetail;
