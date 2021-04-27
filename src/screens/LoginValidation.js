import React, { useEffect, useState } from 'react';
import { userState, initialUserStates } from '../Recoil';
import { useRecoilState } from 'recoil';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client';
import {
  findEmptyKeysInObject,
  findMissingKeysInObject,
} from '../utils/validate';
import { useHistory, Redirect } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { dateEpochToDateString } from '../utils/dates';

const ALL_USERS_FOR_LOGIN = gql`
  query allUsers {
    allUsers {
      users {
        id
        active
        name
        username
        address
        birthday
        email
        phone
        mobile
        work
        workemail
        workphone
        size
        firebaseemail
        firebaseuid
        roles {
          id
          role
        }
      }
    }
  }
`;

const UPDATE_USER_FIREBASE = gql`
  mutation updateUser(
    $id: Int!
    $active: Boolean!
    $name: String!
    $username: String!
    $birthday: String!
    $address: String!
    $email: String!
    $phone: String!
    $mobile: String!
    $work: String!
    $workemail: String!
    $workphone: String!
    $size: String!
    $roles: [Int!]!
    $firebaseemail: String!
    $firebaseuid: String!
  ) {
    updateUser(
      id: $id
      active: $active
      name: $name
      username: $username
      birthday: $birthday
      address: $address
      email: $email
      phone: $phone
      mobile: $mobile
      work: $work
      workemail: $workemail
      workphone: $workphone
      size: $size
      roles: $roles
      firebaseuid: $firebaseuid
      firebaseemail: $firebaseemail
    ) {
      user {
        id
      }
      errors {
        field
        message
      }
    }
  }
`;

export default function LoginValidation() {
  // fetching params info about where to redirect after this page
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);

  // react
  const [missingKeys, setMissingKeys] = useState([]);
  const [emptyKeys, setEmptyKeys] = useState([]);
  const [goto, setGoto] = useState(params.get('to'));
  const [redirectToReferrer2, setRedirectToReferrer2] = useState(false);
  const [userFromGraphQL, setUserFromGraphQL] = useState({});

  // recoil
  const [user, setUser] = useRecoilState(userState);

  // react-router
  const history = useHistory();

  // react-cookie
  const [cookies, setCookie] = useCookies(['user']);

  //graphQL
  const allUsersForLogin = useQuery(ALL_USERS_FOR_LOGIN, {
    fetchPolicy: 'network-only',
  });
  const [updateUserWithFirebaseInfo, { data }] = useMutation(
    UPDATE_USER_FIREBASE,
  );

  useEffect(() => {
    console.log('user 451', user);
    const missing = findMissingKeysInObject(user, initialUserStates);
    const empty = findEmptyKeysInObject(user);
    console.log('missingKeys 481', missing);
    console.log('empty (keys in object) 481', empty);
    setMissingKeys(missing);
    setEmptyKeys(empty);
    const users = allUsersForLogin?.data?.allUsers?.users;
    console.log('users 479', users);
    if ((missingKeys.length > 0 || emptyKeys.length > 0) && users) {
      // todo implement firebaseUid in server database
      const existingUser = users.filter(_user => {
        return _user.email === user.email || _user.workemail === user.email;
      });
      console.log('existingUser 4854', existingUser);
      console.log('existingUser.length > 0 4855', existingUser.length > 0);
      if (existingUser.length > 0) {
        console.log('user 4795', user);
        console.log('existingUser[0] 4796', existingUser[0]);
        setUser(oldUser => ({
          firebaseUid: user.firebaseUid,
          email: user.email,
          iqId: existingUser[0].id,
          username: existingUser[0].username,
          roles: existingUser[0].roles,
          displayName: existingUser[0].name
            ? existingUser[0].name
            : oldUser.displayName,
        }));
        setUserFromGraphQL(existingUser[0]);
      } else {
        console.log('no existing user 4797');
        console.log('users[25].username 4798', users[25].username);
        console.log('users[25] 4799', users[25]);
        setUser(oldUser => ({
          firebaseUid: user.firebaseUid,
          email: user.email,
          iqId: users[25].id,
          username: users[25].username,
          roles: users[25].roles,
          displayName: users[25].name ? users[25].name : oldUser.displayName,
        }));
        setUserFromGraphQL(users[25]);
      }
    }
  }, [allUsersForLogin.loading]);

  useEffect(() => {
    const users = allUsersForLogin?.data?.allUsers?.users;
    console.log('users 480', users);
    console.log('user 481', user);
    console.log('missingKeys 482', missingKeys);
    console.log('emptyKeys 483', emptyKeys);
    // if (users && missingKeys.length === 0 && emptyKeys.length === 0) {
    console.log('missingKeys 457', missingKeys);
    if (user.firebaseUid && user.iqId) {
      handleUpdateUserWithFirebaseInfo();
      setCookie('user', JSON.stringify(user), {
        maxAge: 47433444, // 1½ year
        path: '/',
      });
      setRedirectToReferrer2(true);
    }
    // }
  }, [missingKeys, emptyKeys, user]);

  const handleUpdateUserWithFirebaseInfo = () => {
    console.log('handleUpdateUserWithFirebaseInfo user 74', user);
    console.log('userFromGraphQL 76', userFromGraphQL);
    console.log('user.firebaseUid 777', user.firebaseUid);
    console.log('user.email 778', user.email);
    updateUserWithFirebaseInfo({
      variables: {
        id: user.iqId,
        active: userFromGraphQL.active,
        name: userFromGraphQL.name,
        username: userFromGraphQL.username,
        birthday: dateEpochToDateString(userFromGraphQL.birthday, 'yyyy-MM-DD'),
        address: userFromGraphQL.address,
        email: userFromGraphQL.email,
        phone: userFromGraphQL.phone,
        mobile: userFromGraphQL.mobile,
        work: userFromGraphQL.work,
        workemail: userFromGraphQL.workemail,
        workphone: userFromGraphQL.workphone,
        size: userFromGraphQL.size,
        roles: userFromGraphQL.roles.map(role => role.id),
        firebaseuid: user.firebaseUid ? user.firebaseUid : '',
        firebaseemail: user.email ? user.email : '',
      },
    });
  };

  console.log('missingKeys 456', missingKeys);
  console.log('missingKeys.length === 0 456', missingKeys.length === 0);
  // console.log('!user.iqId 456', !user.iqId);
  console.log('emptyKeys.length === 0 456', emptyKeys.length === 0);
  console.log('user 456', user);

  console.log('redirectToReferrer2 13', redirectToReferrer2);
  // const users = allUsers?.data?.allUsers?.users;
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

  if (allUsersForLogin.loading) {
    return <div>Henter data.</div>;
  }

  // continuing to onboarding page and then the wanted page
  if (redirectToReferrer2) {
    console.log("`${goto || '/'}` 14", `${goto || '/'}`);
    return <Redirect to={`${goto || '/'}`} />;
  }
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
