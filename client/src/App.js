import React from 'react';
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';

import Layout from './components/Layout/Layout';

import History from './pages/History/History';
import Favourites from './pages/Favourites/Favourites';
import Explore from './pages/Explore/Explore';
import Profile from './pages/Profile/Profile';
import Track from './pages/Track/Track';

import Landing from './pages/Landing/Landing';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import RestorePassword from './pages/RestorePassword/RestorePassword';
import './App.css';

const token = localStorage.getItem('token');
const client = new ApolloClient({
  link: new HttpLink({
    // uri: 'http://localhost:4000/graphql',
    uri: 'https://arnoapi.herokuapp.com/graphql',
    headers: {
      token: token || ''
    }
  }),
  cache: new InMemoryCache()
});

const App = () => (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <div className="App">
        {token ? (
          <Layout>
            <Switch>
              <Route exact path="/" component={History} />
              <Route exact path="/favourites" component={Favourites} />
              <Route exact path="/explore" component={Explore} />
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/track/:id" component={Track} />
              <Redirect to="/" />
            </Switch>
          </Layout>
        ) : (
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/restore-password" component={RestorePassword} />
            <Redirect to="/" />
          </Switch>
        )}
      </div>
    </BrowserRouter>
  </ApolloProvider>
);

export default App;
