import * as ReactDOM from 'react-dom';
import {
  ApolloClient,
  ApolloProvider,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import App from './App';
import { SERVER_URL } from './constants';

console.log('SERVER_URL', SERVER_URL);

const httpLink = new HttpLink({
  uri: `${SERVER_URL}/graphql`,
});

const token = localStorage.getItem('auth_token');
// console.log('Bearer token', `Bearer ${token}`);

const authLink = new ApolloLink((operation, forward) => {
  // Retrieve the authorization token from local storage.

  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      authorization: token || '',
    },
  });

  // Call the next link in the middleware chain.
  return forward(operation);
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);
