// import { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
// import { auth } from '../utils/firebase';
// import { userState } from '../Recoil';
// import { useRecoilState } from 'recoil';

export function PrivateRoute({ children, authenticated, ...rest }) {
  console.log('authenticated 15', authenticated);
  // const [user, setUser] = useRecoilState(userState);

  // useEffect(async () => {
  //   console.log('user 888', user);
  //   const _user = auth().currentUser;
  //   let userData = {};
  //   if (_user)
  //     userData = {
  //       displayName: _user.displayName,
  //       email: _user.email,
  //       firebaseUid: _user.uid,
  //     };
  //   setUser(oldUser => ({ ...oldUser, ...userData }));
  // }, []);

  return (
    <Route
      {...rest}
      render={({ location }) => {
        console.log('authenticated 222', authenticated);
        return authenticated ? (
          children
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: location } }} />
        );
      }}
    />
  );
}
