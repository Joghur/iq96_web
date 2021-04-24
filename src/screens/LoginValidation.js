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
  // fetching params info about where to redirect after this page
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const goto = params.get('to');

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
    console.log('user 451', user);
    const missingKeys = findMissingKeysInObject(user, initialUserStates);
    const emptyKeys = findEmptyKeysInObject(user);
    console.log('missingKeys 481', missingKeys);
    console.log('emptyKeys 481', emptyKeys);
    setMissingKeys(missingKeys);
    const users = allUsers?.data?.allUsers?.users;
    console.log('users 479', users);
    if ((missingKeys.length > 0 || emptyKeys.length > 0) && users) {
      // todo implement firbaseUid in server database
      const existingUser = users.filter(_user => {
        return _user.email === user.email || _user.workemail === user.email;
      });
      console.log('existingUser 4854', existingUser);
      console.log('existingUser.length > 0 4855', existingUser.length > 0);
      if (existingUser.length > 0) {
        console.log('user 4795', user);
        console.log('existingUser[0].username 4796', existingUser[0].username);
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
    }
    setTimeout(() => {
      console.log('user 452', user);
      localStorage.setItem('user', JSON.stringify(user));
    }, 300);
  }, [user, allUsers?.data?.allUsers?.users]);

  console.log('user 480', user);
  console.log('missingKeys 456', missingKeys);
  console.log('missingKeys.length = 0 456', missingKeys.length === 0);
  if (missingKeys.length === 0 && user.iqId !== '') {
    console.log('missingKeys 457', missingKeys);
    localStorage.setItem('user', JSON.stringify(user));
    history.push(goto);
  }

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
