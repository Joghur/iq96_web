import React, { useEffect } from 'react';
import { useLocation, Redirect } from 'react-router-dom';
import { signup, signin } from '../utils/auth';
import Snackbar from '../components/Snackbar';

export function Login() {
  const { state } = useLocation();
  const [redirectToReferrer, setRedirectToReferrer] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage('');
    }, 6000);
  }, [errorMessage]);

  const login = async (email, password) => {
    try {
      await signin(email, password);
      setTimeout(() => {
        setRedirectToReferrer(true);
      }, 300);
    } catch (error) {
      console.log('error', error);
      return <Snackbar severity="error">Der er sket en fejl.</Snackbar>;
    }
  };

  const _signup = async (email, password) => {
    try {
      await signup(email, password);
    } catch (error) {
      console.log('error', error.code);
      if (error.code === 'auth/weak-password') {
        setErrorMessage('Kodeordet skal være på mindst 6 tegn.');
      } else {
        setErrorMessage('Der er sket en fejl.');
      }
    }
  };
  console.log('redirectToReferrer', redirectToReferrer);
  console.log('state', state);
  if (redirectToReferrer === true) {
    return <Redirect to={state?.from || '/'} />;
  }

  return (
    <div>
      <p>Du skal logge ind for at se denne side</p>
      <button onClick={() => login('joghur@gmail.com', 'testing')}>
        Log in
      </button>
      <br />
      <button onClick={() => _signup('joghur@gmail.com', 'testing')}>
        signup
      </button>
      {errorMessage && <Snackbar severity="error">{errorMessage}</Snackbar>}
    </div>
  );
}
