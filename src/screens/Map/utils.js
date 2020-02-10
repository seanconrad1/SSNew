import Geolocation from '@react-native-community/geolocation';

export const animateToUserLocation = mapRef => {
  Geolocation.getCurrentPosition(position => {
    mapRef.animateToRegion(
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.115,
        longitudeDelta: 0.1121,
      },
      350,
    );
  });
};