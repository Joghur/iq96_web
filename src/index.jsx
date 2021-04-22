import * as ReactDOM from 'react-dom';
import {
  ApolloClient,
  ApolloProvider,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { RecoilRoot } from 'recoil';
import App from './App';
import { SERVER_URL } from './constants';
import { auth } from './utils/firebase';

let _token;
auth().onAuthStateChanged(async user => {
  console.log('user 125', user);
  if (user) {
    _token = await auth().currentUser.getIdToken();
    localStorage.setItem('auth_token', _token);
    // setAuthenticated(true);
    // setLoading(false);
  } else {
    // setAuthenticated(false);
    // setLoading(false);
  }
});

const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const pdfToken = params.get('pdftoken');

console.log('SERVER_URL 554', SERVER_URL);

const httpLink = new HttpLink({
  uri: `${SERVER_URL}/graphql`,
});

setTimeout(() => {
  console.log('_token 47', _token);

  const authLink = new ApolloLink((operation, forward) => {
    // Use the setContext method to set the HTTP headers.
    operation.setContext({
      headers: {
        authorization: _token || '',
        pdf: pdfToken,
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
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </ApolloProvider>,
    document.getElementById('root'),
  );
}, 1000);
