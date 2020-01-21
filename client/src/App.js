import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import Layout from './components/Layout/Layout';

import History from './pages/History/History';

const httpLink = new HttpLink({
  uri: 'https://arnoapi.herokuapp.com/graphql',
  headers: {
    token: localStorage.getItem('token') || ''
  }
});

const wsLink = new WebSocketLink({
  uri: `ws://arnoapi.herokuapp.com/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      token: localStorage.getItem('token') || ''
    }
  }
});

const client = new ApolloClient({
  link: split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink
  ),
  cache: new InMemoryCache()
});

const App = () => (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <Layout>
        <Switch>
          <Route exact path="/" component={History} />
          <Route exact path="/favourites" component={() => 'favourites'} />
          <Route exact path="/explore" component={() => 'explore'}
          />
          <Route exact path="/profile" component={() => 'profile'} />
        </Switch>
      </Layout>
    </BrowserRouter>
  </ApolloProvider>
);

export default App;
