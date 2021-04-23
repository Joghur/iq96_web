import { auth } from '../utils/firebase';

export function signup(email, password) {
  return auth().createUserWithEmailAndPassword(email, password);
}

export function signin(email, password) {
  console.log('signin 47', email, password);
  return auth().signInWithEmailAndPassword(email, password);
}

export function logout() {
  console.log('logout 1584');
  localStorage.removeItem('auth_token');
  return auth().signOut();
}

export const loginFacebook = () => {
  console.log('loginFacebook 1585');
  return handleLogin(new auth.FacebookAuthProvider());
};

export const loginGoogle = () => {
  console.log('loginGoogle 1586');
  return handleLogin(new auth.GoogleAuthProvider());
};

const handleLogin = async provider => {
  const result = await auth().signInWithPopup(provider);
  // The signed-in user info.
  const user = result.user;
  return user;
};
