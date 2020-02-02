import gql from 'graphql-tag';

const LOGIN_MUTATION = gql`
  query getUsers {
    getUsers {
      name
      bookmarks {
        name
        owner {
          _id
        }
        description
        images {
          base64
        }
        location {
          longitude
          latitude
        }
        kickout_level
      }
    }
  }
`;
export default LOGIN_MUTATION;
