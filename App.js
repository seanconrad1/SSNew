import React from 'react';
// import {GRAPHQL_URL} from 'react-native-dotenv';

//Components
//Apollo
import {Text} from 'react-native';
import {ApolloClient} from 'apollo-client';
import {ApolloProvider} from '@apollo/react-hooks';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';
import unfetch from 'unfetch';
import Navigation from './src/navigation';

// Create the client as outlined in the setup guide

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'http://localhost:4000/graphql',
  fetch: unfetch,
});

const client = new ApolloClient({
  cache,
  link,
});

const setUser = newUser => {
  user = newUser;
};

let user = {
  name: '',
  email: '',
  token: '',
  authorized: false,
  setUser,
};

export const UserContext = React.createContext(null);

const App = () => {
  return (
    <ApolloProvider client={client}>
      <UserContext.Provider value={user}>
        <Navigation />
      </UserContext.Provider>
    </ApolloProvider>
  );
};
export default App;
