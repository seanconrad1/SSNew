export const newSpotState = {
  name: null,
  description: null,
  kickout_level: 0,
  photo: false,
  validation: false,
  streetSpotType: 0,
  spotContains: [],
  selectedLat: null,
  selectedLng: null,
  spotSubmitted: false,
  currentLocationSelected: false,
  locationSelected: false,
};

export function reducer(state, action) {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.payload };
    case 'SET_DESCRIPTION':
      return { ...state, description: action.payload };
    case 'SET_KICKOUT_LEVEL':
      return { ...state, kickout_level: action.payload };
    case 'SET_PHOTO':
      if (state.photo) {
        return { ...state, photo: [...state.photo, action.payload] };
      } else if (!state.photo) {
        return { ...state, photo: [action.payload] };
      }
      break;
    case 'SPOT_SUBMITED':
      return { ...state, spotSubmitted: action.payload };
    case 'SET_CURRENT_LOCATION':
      return {
        ...state,
        selectedLat: action.payload.latitude,
        selectedLng: action.payload.longitude,
        currentLocationSelected: true,
        locationSelected: false,
      };
    case 'REMOVE_LOCATION':
      return {
        ...state,
        selectedLat: null,
        selectedLng: null,
        currentLocationSelected: false,
      };
    case 'SET_LOCATION':
      return {
        ...state,
        selectedLat: action.payload.latitude,
        selectedLng: action.payload.longitude,
        locationSelected: true,
        currentLocationSelected: false,
      };
    default:
      throw new Error();
  }
}
