import * as ReactDOM from 'react-dom';
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import App from './App';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://192.168.1.29:4000/graphql',
  }),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);
