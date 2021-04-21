import { Route, Redirect } from 'react-router-dom';

export function PrivateRoute({ children, authenticated, pdf, ...rest }) {
  console.log('authenticated 15', authenticated);

  return (
    <Route
      {...rest}
      render={({ location }) => {
        return authenticated || pdf ? (
          children
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: location } }} />
        );
      }}
    />
  );
}
