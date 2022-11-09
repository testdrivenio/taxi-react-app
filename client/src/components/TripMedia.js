import React from 'react';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function TripMedia ({ trip, group, otherGroup }) {
  const user = trip[otherGroup];
  const photoUrl = new URL(user.photo, process.env.REACT_APP_BASE_URL).href;
  const href = group ? `/${group}/${trip.id}` : undefined;

  return (
    <div className='mb-3'>
      <div className='d-flex'>
        <div className='flex-shrink-0'>
          <img
            alt={user}
            className='rounded-circle'
            src={photoUrl}
            width={80}
            height={80}
          />
        </div>
        <div className='flex-grow-1 ms-3'>
          <h5 className='mt-0 mb-1 fw-bold'>{user.first_name} {user.last_name}</h5>
          <p>
            <strong>{trip.pick_up_address}</strong> to <strong>{trip.drop_off_address}</strong><br />
            <span className='text-secondary'>{trip.status}</span>
          </p>
        </div>
      </div>
      {
        href && (
          <div className='d-grid mt-3'>
            <LinkContainer to={href}>
              <Button variant='primary'>Detail</Button>
            </LinkContainer>
          </div>
        )
      }
    </div>
  );
}

export default TripMedia;
