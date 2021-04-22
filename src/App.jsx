import {
  ApolloClient,
  ApolloProvider,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { useRecoilValue } from 'recoil';
import Routing from './Routing';
import { SERVER_URL } from './constants';
import { userState } from './Recoil';

function App() {
  const user = useRecoilValue(userState);

  const httpLink = new HttpLink({
    uri: `${SERVER_URL}/graphql`,
  });

  const authLink = new ApolloLink((operation, forward) => {
    // Use the setContext method to set the HTTP headers.
    operation.setContext({
      headers: {
        authorization: user.token || '',
      },
    });

    // Call the next link in the middleware chain.
    return forward(operation);
  });

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });

  return (
    <ApolloProvider client={client}>
      <Routing />
    </ApolloProvider>
  );
}

export default App;
