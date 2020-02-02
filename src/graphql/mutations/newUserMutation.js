import gql from 'graphql-tag';

const CREATE_USER = gql`
  mutation createUser($userInput: userInputData) {
    createUser(userInput: $userInput) {
      name
      email
    }
  }
`;

export default CREATE_USER;
