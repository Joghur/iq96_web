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
  const provider = new auth.FacebookAuthProvider();

  return auth()
    .signInWithPopup(provider)
    .then(result => {
      // The signed-in user info.
      const user = result.user;
      // console.log('loginFacebook user 98', user);
      return user;
    })
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      const credential = error.credential;
      console.log('errorCode 100', errorCode);
      console.log('errorMessage 101', errorMessage);
      console.log('email 102', errorCemailode);
      console.log('credential 103', credential);
    });
};
