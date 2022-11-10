import React, { useState } from 'react';
import {
  DirectionsRenderer,
  DirectionsService,
  GoogleMap,
  LoadScript,
  Marker
} from '@react-google-maps/api';

function Map ({ dropOffAddress, lat, lng, pickUpAddress, zoom }) {
  const [response, setResponse] = useState(null);

  const hasTwoAddresses = (
    pickUpAddress !== '' &&
    dropOffAddress !== ''
  );

  const directionsCallback = (response) => {
    if (response !== null && response.status === 'OK') {
      setResponse(response);
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY}
    >
      <GoogleMap
        center={{
          lat,
          lng,
        }}
        mapContainerStyle={{
          width: '100%',
          height: '300px',
          marginBottom: '10px',
        }}
        zoom={zoom}
      >
        {
          hasTwoAddresses && (
            <DirectionsService
              options={{
                origin: pickUpAddress,
                destination: dropOffAddress,
                travelMode: 'DRIVING',
              }}
              callback={directionsCallback}
            />
          )
        }
        {
          hasTwoAddresses && response !== null && (
            <DirectionsRenderer
              options={{
                directions: response,
              }}
            />
          )
        }
        {
          !hasTwoAddresses && (
            <Marker label='A' position={{ lat, lng }} />
          )
        }
      </GoogleMap>
    </LoadScript>
  );
}

export default Map;
