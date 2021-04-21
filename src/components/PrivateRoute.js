import { Route, Redirect } from 'react-router-dom';

export function PrivateRoute({ children, authenticated, ...rest }) {
  console.log('athenticated', authenticated);

  return (
    <Route
      {...rest}
      render={({ location }) => {
        return authenticated ? (
          children
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: location } }} />
        );
      }}
    />
  );
}
