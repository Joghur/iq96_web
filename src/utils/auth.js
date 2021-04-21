import { auth } from '../utils/firebase';

export function signup(email, password) {
  return auth().createUserWithEmailAndPassword(email, password);
}

export function signin(email, password) {
  return auth().signInWithEmailAndPassword(email, password);
}

export function logout() {
  localStorage.removeItem('auth_token');
  return auth().signOut();
}
