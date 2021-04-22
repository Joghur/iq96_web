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
