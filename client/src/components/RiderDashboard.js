import React, { useEffect, useState } from 'react';
import {
  Breadcrumb, Col, Row
} from 'react-bootstrap';
import { toast } from 'react-toastify';

import TripCard from './TripCard';
import { connect, getTrips, messages } from '../services/TripService';

function RiderDashboard (props) {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const loadTrips = async () => {
      const { response, isError } = await getTrips();
      if (isError) {
        setTrips([]);
      } else {
        setTrips(response.data);
      }
    }
    loadTrips();
  }, []);

  useEffect(() => {
    connect();
    const subscription = messages.subscribe((message) => {
      setTrips(prevTrips => [
        ...prevTrips.filter(trip => trip.id !== message.data.id),
        message.data
      ]);
      updateToast(message.data);
    });
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    }
  }, [setTrips]);

  const getCurrentTrips = () => {
    return trips.filter(trip => {
      return (
        trip.driver !== null &&
        trip.status !== 'REQUESTED' &&
        trip.status !== 'COMPLETED'
      );
    });
  };

  const getCompletedTrips = () => {
    return trips.filter(trip => {
      return trip.status === 'COMPLETED';
    });
  };

  const updateToast = (trip) => {
    if (trip.status === 'STARTED') {
      toast.info(`Driver ${trip.driver.username} is coming to pick you up.`);
    } else if (trip.status === 'IN_PROGRESS') {
      toast.info(`Driver ${trip.driver.username} is headed to your destination.`);
    } else if (trip.status === 'COMPLETED') {
      toast.info(`Driver ${trip.driver.username} has dropped you off.`);
    }
  };

  return (
    <Row>
      <Col lg={12}>
        <Breadcrumb>
          <Breadcrumb.Item href='/'>Home</Breadcrumb.Item>
          <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
        </Breadcrumb>

        <TripCard
          title='Current Trip'
          trips={getCurrentTrips()}
          group='rider'
          otherGroup='driver'
        />

        <TripCard
          title='Recent Trips'
          trips={getCompletedTrips()}
          group='rider'
          otherGroup='driver'
        />

      </Col>
    </Row>
  );
}

export default RiderDashboard;
