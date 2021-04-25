import { atom } from 'recoil';

export const initialUserStates = {
  displayName: '',
  email: '',
  firebaseUid: '',
  iqId: '',
  roles: [],
  username: '',
};

export const userState = atom({
  key: 'userState',
  default: initialUserStates,
});

export const tokenState = atom({
  key: 'tokenState',
  default: {
    token: '',
  },
});
