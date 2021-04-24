import { atom } from 'recoil';

export const initialUserStates = {
  displayName: '',
  email: '',
  firebaseUid: '',
  iqId: '',
  roles: [],
  token: '',
  username: '',
};

export const userState = atom({
  key: 'userState',
  default: initialUserStates,
});
