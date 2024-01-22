import React from 'react'
import { Card } from 'react-bootstrap'

import TripMedia from './TripMedia.jsx'

export default function TripCard ({ title, trips, group, otherGroup }) {
  let cardBody
  let mediaList

  if (trips.length === 0) {
    cardBody = <>No trips.</>
  } else {
    mediaList = trips.map(trip =>
      <TripMedia
        trip={trip}
        group={group}
        otherGroup={otherGroup}
        key={trip.id}
      />
    )
    cardBody = mediaList
  }
  return (
    <Card className='mb-3' data-cy='trip-card'>
      <Card.Header>{title}</Card.Header>
      <Card.Body>{cardBody}</Card.Body>
    </Card>
  )
}
