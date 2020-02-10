import gql from 'graphql-tag';

const GET_SPOTS = gql`
  query getSpots {
    getSpots {
      name
      location {
        latitude
        longitude
      }
      description
      kickout_level
    }
  }
`;

export default GET_SPOTS;
