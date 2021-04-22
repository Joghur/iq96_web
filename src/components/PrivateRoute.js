import { Route, Redirect } from 'react-router-dom';

export function PrivateRoute({ children, authenticated, pdf, ...rest }) {
  console.log('authenticated 15', authenticated);

  return (
    <Route
      {...rest}
      render={({ location }) => {
        console.log('authenticated 222', authenticated);
        console.log(' pdf 111', pdf);
        console.log(' (authenticated || pdf) 333', authenticated || pdf);
        return authenticated || pdf ? (
          children
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: location } }} />
        );
      }}
    />
  );
}
