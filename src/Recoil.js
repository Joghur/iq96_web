import { atom } from 'recoil';

export const userState = atom({
  key: 'userState',
  default: {
    displayName: '',
    email: '',
    firebaseUid: '',
    iqId: '',
    role: '',
    token: '',
    username: '',
  },
});
