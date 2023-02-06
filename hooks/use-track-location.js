import { useContext, useState } from 'react';

import { ACTION_TYPES, StoreContext } from '../store/store.context';

const useTrackLocation = () => {
  const [locationErrorMessage, setLocationErrorMessage] = useState('');
  const [isFindingLocation, setIsFindingLocation] = useState(false);

  const { dispatch } = useContext(StoreContext);

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    dispatch({
      type: ACTION_TYPES.SET_LAT_LONG,
      payload: { latLong: `${latitude},${longitude}` },
    });

    setIsFindingLocation(false);
    setLocationErrorMessage('');
  };

  const error = () => {
    setIsFindingLocation(false);
    setLocationErrorMessage('Unable to track your location.');
  };

  const handleTrackLocation = () => {
    setIsFindingLocation(true);
    if (!navigator.geolocation) {
      setIsFindingLocation(false);
      setLocationErrorMessage('Geolocation is not supported by your browser.');
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return {
    isFindingLocation,
    locationErrorMessage,
    handleTrackLocation,
  };
};

export default useTrackLocation;
