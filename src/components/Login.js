import React, { useEffect } from 'react';
import { useLocation, Redirect } from 'react-router-dom';
import { signup, signin } from '../utils/auth';
import Snackbar from '../components/Snackbar';
import { TextField, Tooltip, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import validate, { isEmptyObject } from '../utils/validate';
import { userState } from '../Recoil';
import { useRecoilValue } from 'recoil';
import { useGradientBtnStyles } from '@mui-treasury/styles/button/gradient';
import { usePushingGutterStyles } from '@mui-treasury/styles/gutter/pushing';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: '10px',
    display: 'flex',
    flexWrap: 'wrap',
  },
  errorColor: {
    color: 'red',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '25ch',
  },
  textFieldLarger: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '52ch',
  },
}));

export function Login() {
  // recoil
  const user = useRecoilValue(userState);

  // material-ui
  const classes = useStyles();
  const styles = useGradientBtnStyles();
  const chubbyStyles = useGradientBtnStyles({ chubby: true });
  const gutterStyles = usePushingGutterStyles({
    cssProp: 'marginBottom',
    space: 2,
  });

  // react-router
  const { state } = useLocation();

  // react
  const [redirectToReferrer, setRedirectToReferrer] = React.useState(false);
  const [signingUp, setSigningUp] = React.useState(false);
  const [emailPassword, setEmailPassword] = React.useState({
    email: user.email,
  });
  const [errorMessage, setErrorMessage] = React.useState({});

  // Handles all changes
  const handleChange = event => {
    let id = event?.target?.id;
    let value = event?.target?.value;

    // console.log('event.target 143', event?.target);
    console.log('id in 144', id);
    // console.log('value 145', value);

    const validated = validate(id, value);
    console.log('validated.errorMessage 10 ', validated.errorMessage);
    // if something is not validated exit function and set error states
    if (validated.errorMessage) {
      setErrorMessage({ [id]: validated.errorMessage });
    } else {
      // if everything is validated correctly continue with setting email/password states
      setErrorMessage({});
    }

    console.log('id out', id);

    // insert new values in emailPassword object
    setEmailPassword(emailPassword => {
      return { ...emailPassword, [id]: validated.value };
    });
  };

  const login = async () => {
    if (!isEmptyObject(errorMessage)) {
      return;
    }
    try {
      await signin(emailPassword.email, emailPassword.password);
      setTimeout(() => {
        setRedirectToReferrer(true);
      }, 500);
    } catch (error) {
      console.log('error', error.code);
      if (error.code === 'auth/too-many-requests') {
        setErrorMessage({ email: 'For mange forsøg. Prøv igen senere' });
      } else {
        setErrorMessage({ email: 'Der er sket en fejl.' });
      }
    }
  };

  const _signup = async () => {
    if (emailPassword.password !== emailPassword.repeatPassword) {
      setErrorMessage({ password: 'Kodeord skal matche' });
      return;
    }

    if (!isEmptyObject(errorMessage) || emailPassword.quiz.length === 0) {
      return;
    }
    try {
      await signup(emailPassword.email, emailPassword.password);
      setTimeout(() => {
        setRedirectToReferrer(true);
      }, 500);
    } catch (error) {
      console.log('error', error.code);
      if (error.code === 'auth/weak-password') {
        setErrorMessage({ password: 'Kodeordet skal være på mindst 6 tegn.' });
      } else if (error.code === 'auth/argument-error') {
        setErrorMessage({ password: 'Der mangler noget information' });
      } else {
        setErrorMessage({ email: 'Der er sket en fejl.' });
      }
    }
  };

  const loginFacebook = () => {
    console.log('næste');
  };

  console.log('isEmptyObject(errorMessage) 6', isEmptyObject(errorMessage));
  // console.log('redirectToReferrer', redirectToReferrer);
  // console.log('state', state);

  if (redirectToReferrer === true) {
    return <Redirect to={state?.from || '/'} />;
  }

  console.log(
    'emailPassword.email, emailPassword.password  repeatPassword emailPassword.quiz 1598',
    emailPassword.email,
    emailPassword.password,
    emailPassword.repeatPassword,
    emailPassword.quiz,
  );
  return (
    <div>
      {signingUp ? (
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          <p>Brug en af følgende metoder til at melde dig til IQ96.dk</p>
          <Button color="primary" onClick={() => setSigningUp(false)}>
            Tryk her for at logge ind
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          <p>Du skal logge ind for at se indhold</p>
          <Button color="primary" onClick={() => setSigningUp(true)}>
            Tryk her for at tilmelde dig. Det er meget let
          </Button>
        </div>
      )}
      <div style={{ padding: 15 }}>
        <div style={{ margin: 5 }}>
          <Tooltip title="Opret dig via email og kodeord">
            <Button
              classes={chubbyStyles}
              onClick={signingUp ? _signup : login}
            >
              Email
            </Button>
          </Tooltip>
        </div>
        <TextField
          id="email"
          label="Email"
          error={!!errorMessage.email}
          value={emailPassword.email}
          className={classes.textFieldLarger}
          margin="dense"
          onChange={handleChange}
          variant="outlined"
          helperText={errorMessage.email && errorMessage.email}
        />
        <TextField
          id="password"
          label="Kodeord (mindst 6 tegn)"
          type="password"
          error={!!errorMessage.password}
          value={emailPassword.password}
          className={classes.textFieldLarger}
          margin="dense"
          onChange={handleChange}
          variant="outlined"
          helperText={errorMessage.password && errorMessage.password}
        />
        {signingUp && (
          <>
            <TextField
              id="repeatPassword"
              label="Gentag kodeord"
              type="password"
              error={!!errorMessage.repeatPassword}
              value={emailPassword.repeatPassword}
              className={classes.textFieldLarger}
              margin="dense"
              onChange={handleChange}
              variant="outlined"
              helperText={
                errorMessage.repeatPassword && errorMessage.repeatPassword
              }
            />
            <TextField
              id="quiz"
              label="Hvad er efternavnet på vores chef"
              error={!!errorMessage.quiz}
              value={emailPassword.quiz}
              className={classes.textFieldLarger}
              margin="dense"
              onChange={handleChange}
              variant="outlined"
              helperText={errorMessage.quiz && errorMessage.quiz}
            />
          </>
        )}
      </div>
      <div style={{ padding: 15 }}>
        <div style={{ margin: 5 }}>
          <Tooltip title="Opret dig via Facebook. Der modtages kun email og navn fra Facebook">
            <Button classes={chubbyStyles} onClick={loginFacebook}>
              Facebook
            </Button>
          </Tooltip>
        </div>
      </div>
      <div style={{ padding: 15 }}>
        <div style={{ margin: 5 }}>
          <Tooltip title="Opret dig via Google. Der modtages kun email og navn fra Google">
            <Button classes={chubbyStyles} onClick={loginFacebook}>
              Google
            </Button>
          </Tooltip>
        </div>
      </div>
      {!isEmptyObject(errorMessage) && (
        <Snackbar severity="error">
          {errorMessage?.email ||
            errorMessage?.password ||
            errorMessage?.repeatPassword}
        </Snackbar>
      )}
    </div>
  );
}
