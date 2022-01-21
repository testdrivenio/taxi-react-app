import axios from 'axios';
import { share } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';

import { getAccessToken } from './AuthService';

let _socket;
export let messages;

export const connect = () => {
  if (!_socket || _socket.closed) {
    const token = getAccessToken();
    _socket = webSocket(`ws://localhost:8003/taxi/?token=${token}`);
    messages = _socket.pipe(share());
    messages.subscribe(message => console.log(message));
  }
};

export const createTrip = (trip) => {
  connect();
  const message = {
    type: 'create.trip',
    data: trip
  };
  _socket.next(message);
};

export const getTrip = async (id) => {
  const url = `${process.env.REACT_APP_BASE_URL}/api/trip/${id}/`;
  const token = getAccessToken();
  const headers = { Authorization: `Bearer ${token}` };
  try {
    const response = await axios.get(url, { headers });
    return { response, isError: false };
  } catch (response) {
    return { response, isError: true };
  }
};

export const getTrips = async () => {
  const url = `${process.env.REACT_APP_BASE_URL}/api/trip/`;
  const token = getAccessToken();
  const headers = { Authorization: `Bearer ${token}` };
  try {
    const response = await axios.get(url, { headers });
    return { response, isError: false };
  } catch (response) {
    return { response, isError: true };
  }
};

export const updateTrip = (trip) => {
  connect();
  const message = {
    type: 'update.trip',
    data: trip
  };
  _socket.next(message);
};
