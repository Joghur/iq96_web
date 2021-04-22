import { atom } from 'recoil';

export const userState = atom({
  key: 'userState',
  default: {
    displayName: '',
    email: '',
    firebaseUid: '',
    token: '',
  },
});
