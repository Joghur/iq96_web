import React, { useEffect, useState } from 'react';
import { userState, initialUserStates } from '../Recoil';
import { useRecoilState } from 'recoil';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import {
  findEmptyKeysInObject,
  findMissingKeysInObject,
} from '../utils/validate';
import { useHistory } from 'react-router-dom';

const ALL_USERS_FOR_LOGIN = gql`
  query allUsers {
    allUsers {
      users {
        id
        name
        username
        email
        workemail
        roles {
          role
        }
      }
    }
  }
`;

export default function LoginValidation() {
  // react
  const [missingKeys, setMissingKeys] = useState([]);

  // recoil
  const [user, setUser] = useRecoilState(userState);

  //grapgQL
  const allUsers = useQuery(ALL_USERS_FOR_LOGIN);

  // react-router
  const history = useHistory();

  // useEffect(() => {
  //   // console.log('user 479', user);
  // }, [user]);

  useEffect(() => {
    const missing = findMissingKeysInObject(user, initialUserStates);
    console.log('missing 481', missing);
    // setMissingKeys(missing);
    const users = allUsers?.data?.allUsers?.users;
    console.log('users 479', users);
    if (missing.length > 0 && users) {
      // todo implement firbaseUid in server database
      const existingUser = users.filter(_user => {
        return _user.email === user.email || _user.workemail === user.email;
      });
      console.log('existingUser 4854', existingUser);
      console.log('existingUser.length > 0 4855', existingUser.length > 0);
      if (existingUser.length > 0) {
        console.log('user 4795', user);
        setUser({
          token: user.token,
          firebaseUid: user.firebaseUid,
          email: user.email,
          iqId: existingUser[0].id,
          username: existingUser[0].username,
          roles: existingUser[0].roles,
          displayName: existingUser[0].name && existingUser[0].name,
        });
      }
      localStorage.setItem('user', JSON.stringify(user));
      history.push('/users');
    }
  }, [user, allUsers?.data?.allUsers?.users]);

  console.log('user 479', user);
  console.log('missing 456', missingKeys);

  const users = allUsers?.data?.allUsers?.users;
  // console.log('users 484', users);

  // useEffect(() => {
  //   const users = allUsers?.data?.allUsers?.users;
  //   console.log('typeof users 478', typeof users);
  //   console.log('users 479', users);
  //   // checking for array (JS arrays are both objects and arrays so have to check both)
  //   if (users instanceof Object && users instanceof Array) {
  //     setEmptyKeys(findEmptyKeysInObject(user));
  //   }
  // }, [allUsers?.data]);

  return (
    <>
      <div>LoginValidation</div>
      <ul>
        {missingKeys &&
          missingKeys.map(key => {
            return <li>{key}</li>;
          })}
      </ul>
    </>
  );
}
