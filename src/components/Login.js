import React from 'react';
import { useLocation, Redirect } from 'react-router-dom';
import { signup, signin, loginFacebook, loginGoogle } from '../utils/auth';
import Snackbar from '../components/Snackbar';
import { TextField, Tooltip, Button, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import validate, { isEmptyObject } from '../utils/validate';
import { userState } from '../Recoil';
import { useRecoilState } from 'recoil';
import { useGradientBtnStyles } from '@mui-treasury/styles/button/gradient';
import { usePushingGutterStyles } from '@mui-treasury/styles/gutter/pushing';
import { auth } from '../utils/firebase';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';

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
  const [user, setUser] = useRecoilState(userState);
  console.log('user 874', user);

  // react-cookie
  const [cookies, setCookies] = useCookies(['quiz']);
  console.log('cookies 874', cookies);

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
  const history = useHistory();

  // react
  const [redirectToReferrer, setRedirectToReferrer] = React.useState(false);
  const [signingUp, setSigningUp] = React.useState(false);
  const [form, setForm] = React.useState({
    email: user.email,
    quiz: cookies.quiz,
  });
  const [errorMessage, setErrorMessage] = React.useState({});

  console.log('form 874', form);

  // Handles all changes
  const handleChange = event => {
    let id = event?.target?.id;
    let value = event?.target?.value;

    // console.log('event.target 143', event?.target);
    console.log('id in 874', id);
    console.log('value 874', value);

    const validated = validate(id, value);
    console.log('validated.errorMessage 10', validated.errorMessage);
    // if something is not validated exit function and set error states
    if (validated.errorMessage) {
      setErrorMessage({ [id]: validated.errorMessage });
    } else {
      // if everything is validated correctly continue with setting email/password states
      setErrorMessage({});
    }

    console.log('id out', id);

    // insert new values in form object
    setForm(oldForm => {
      return { ...oldForm, [id]: validated.value };
    });
  };

  const login = async () => {
    if (!isEmptyObject(errorMessage)) {
      return;
    }

    let emailLoginUser;
    try {
      emailLoginUser = await signin(form.email, form.password);
      if (emailLoginUser) {
        setUser(async oldUser => ({
          ...oldUser,
          email: emailLoginUser.email,
          displayName: emailLoginUser.email,
          firebaseUid: emailLoginUser.uid,
        }));
      }
      setTimeout(() => {
        setRedirectToReferrer(true);
      }, 500);
    } catch (error) {
      console.log('error 201', error);
      console.log('error.code 201', error.code);
      if (error.code === 'auth/too-many-requests') {
        setErrorMessage({ email: 'For mange forsøg. Prøv igen senere' });
      } else {
        setErrorMessage({ email: 'Der er sket en fejl.' });
      }
    }
  };

  const _signup = async () => {
    if (form.password !== form.repeatPassword) {
      setErrorMessage({ password: 'Kodeord skal matche' });
      return;
    }

    const validated = validate('quiz', form.quiz ? form.quiz : '');

    // some fields need to be validated before continuing
    if (!form.quiz || !validated.ok) {
      setErrorMessage({});
      setErrorMessage({ quiz: 'Quiz feltet skal udfyldes' });
      return;
    }

    // save a cookie for future logins
    console.log('form.quiz 874', form.quiz);
    setCookies('quiz', form.quiz, {
      maxAge: 47433444, // 1½ year
      path: '/',
    });

    let emailUser;
    try {
      emailUser = await signup(form.email, form.password);
      console.log('_signup emailUser 15', emailUser);
      if (emailUser) {
        setUser(async oldUser => ({
          ...oldUser,
          email: emailUser.email,
          displayName: emailUser.email,
          firebaseUid: emailUser.uid,
        }));
      }
      setTimeout(() => {
        setRedirectToReferrer(true);
      }, 500);
    } catch (error) {
      console.log('error.code 202', error.code);
      console.log('error 202', error);
      setErrorMessage({}); // clear errorMessage to provoke a response
      if (error.code === 'auth/weak-password') {
        setErrorMessage({ password: 'Kodeordet skal være på mindst 6 tegn.' });
      } else if (error.code === 'auth/argument-error') {
        setErrorMessage({ password: 'Der mangler noget information' });
      } else {
        setErrorMessage({ email: 'Der er sket en fejl.' });
      }
    }
  };

  const handleLoginFacebook = async () => {
    console.log('handleLoginFacebook 104');
    setForm({}); // emptying email/password to avoid errors

    const validated = validate('quiz', form.quiz ? form.quiz : '');

    // some fields need to be validated before continuing
    if (!form.quiz || !validated.ok) {
      setErrorMessage({});
      setErrorMessage({ quiz: 'Quiz feltet skal udfyldes' });
      return;
    }

    // save a cookie for future logins
    console.log('form.quiz 874', form.quiz);
    setCookies('quiz', form.quiz, {
      maxAge: 47433444, // 1½ year
      path: '/',
    });

    let fbUser;
    try {
      fbUser = await loginFacebook();
      console.log('handleLoginFacebook user 105', fbUser);
      if (fbUser) {
        setUser(oldUser => {
          console.log('oldUser 587', oldUser);
          return {
            ...oldUser,
            displayName: fbUser.displayName,
            firebaseUid: fbUser.uid,
          };
        });
      }
      setTimeout(() => {
        setRedirectToReferrer(true);
      }, 500);
    } catch (error) {
      console.log('error 203', error);
      console.log('error.code 203', error.code);
      setErrorMessage({}); // clear errorMessage to provoke a response
      if (error.code === 'auth/account-exists-with-different-credential') {
        setErrorMessage({
          facebook:
            'Du er tidligere logget ind med en Google. Brug denne metode igen',
        });
      } else {
        setErrorMessage({ facebook: 'Der er sket en fejl.' });
      }
    }
  };

  const handleLoginGoogle = async () => {
    console.log('handleLoginGoogle 106');
    setForm({}); // emptying email/password to avoid errors

    const validated = validate('quiz', form.quiz ? form.quiz : '');

    // some fields need to be clear before continuing
    if (!form.quiz || !validated.ok) {
      setErrorMessage({});
      setErrorMessage({ quiz: 'Quiz feltet skal udfyldes' });
      return;
    }

    // save a cookie for future logins
    setCookies('quiz', form.quiz, {
      maxAge: 47433444, // 1½ year
      path: '/',
    });

    let googleUser;
    try {
      googleUser = await loginGoogle();
      console.log('loginGooghandleLoginGooglele googleUser 107', googleUser);
      if (googleUser) {
        setUser(oldUser => ({
          ...oldUser,
          displayName: googleUser.displayName,
          firebaseUid: googleUser.uid,
        }));
      }
      setTimeout(() => {
        setRedirectToReferrer(true);
      }, 500);
    } catch (error) {
      setErrorMessage({}); // clear errorMessage to provoke a response
      if (error.code === 'auth/account-exists-with-different-credential') {
        setErrorMessage({
          google:
            'Du er tidligere logget ind med en Facebook eller email. Brug denne metode igen',
        });
      } else {
        setErrorMessage({ google: 'Der er sket en fejl.' });
      }
    }
  };

  console.log('isEmptyObject(errorMessage 6', isEmptyObject(errorMessage));

  // continuing to onboarding page and then the wanted page
  if (redirectToReferrer === true) {
    return (
      <Redirect to={`/loginvalidation?to=${state?.from.pathname || '/'}`} />
    );
  }

  return (
    <div>
      {signingUp ? (
        <div>
          <h2>Oprettelse af bruger</h2>
          <ol>
            <li>Besvar quiz'en</li>
            <li>Brug en af følgende metoder til at melde dig til IQ96.dk</li>
            <ul>
              <li>Email</li>
              <li>facebook</li>
              <li>Google</li>
            </ul>
          </ol>
          <Button color="primary" onClick={() => setSigningUp(false)}>
            Tryk her for at logge ind
          </Button>
        </div>
      ) : (
        <div>
          <h2>Login</h2>
          <p>
            Brug en af følgende metoder til at logge ind. Du bliver registreret
            på siden ved (for email) at bruge link nedenunder eller (for Google
            og facebook) bare at bruge "Login via..." knapperne.
          </p>
          <ul>
            <li>Email</li>
            <li>facebook</li>
            <li>Google</li>
          </ul>
          <Button color="primary" onClick={() => setSigningUp(true)}>
            Tryk her for at tilmelde dig via --{'>'} email {'<'}---
          </Button>
        </div>
      )}
      <div
        style={{
          marginTop: 10,
          width: 454,
        }}
      >
        <Tooltip title="En lille test for at se om du er IQ'er">
          <Paper>
            <div
              style={{
                paddingTop: 5,
                paddingLeft: 5,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <p>IQ96 quiz</p>
            </div>
            <TextField
              id="quiz"
              label="Hvad er efternavnet på vores chef"
              type="password"
              error={!!errorMessage.quiz}
              value={form?.quiz}
              className={classes.textFieldLarger}
              margin="dense"
              onChange={handleChange}
              variant="outlined"
              helperText={errorMessage.quiz && errorMessage.quiz}
            />
          </Paper>
        </Tooltip>
      </div>
      <div
        style={{
          padding: 15,
          width: 454,
        }}
      >
        <Tooltip title="Opret dig via email og kodeord">
          <Paper>
            <div
              style={{
                paddingTop: 5,
                paddingLeft: 5,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <p>Email</p>
            </div>
            <TextField
              id="email"
              label="Email"
              error={!!errorMessage.email}
              value={form.email}
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
              value={form.password}
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
                  value={form.repeatPassword}
                  className={classes.textFieldLarger}
                  margin="dense"
                  onChange={handleChange}
                  variant="outlined"
                  helperText={
                    errorMessage.repeatPassword && errorMessage.repeatPassword
                  }
                />
              </>
            )}
            <div
              style={{
                margin: 5,
                paddingBottom: 10,
              }}
            >
              <Button
                classes={chubbyStyles}
                onClick={signingUp ? _signup : login}
              >
                {signingUp
                  ? 'Tilmeld via Email/kodeord'
                  : 'Login via Email/kodeord'}
              </Button>
            </div>
          </Paper>
        </Tooltip>
      </div>
      <div
        style={{
          padding: 15,
          width: 240,
        }}
      >
        <Tooltip title="Opret dig via Facebook. IQ96.dk modtager kun email og navn fra Facebook (og et 'profilbillede' af en grå silhuet)">
          <Paper>
            <div
              style={{
                paddingTop: 5,
                paddingLeft: 5,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <p>Facebook</p>
            </div>
            <div
              style={{
                margin: 5,
                paddingBottom: 10,
              }}
            >
              <Button classes={chubbyStyles} onClick={handleLoginFacebook}>
                {signingUp ? 'Tilmeld via Facebook' : 'Login via Facebook'}
              </Button>
            </div>
          </Paper>
        </Tooltip>
      </div>
      <div
        style={{
          padding: 15,
          width: 240,
        }}
      >
        <Tooltip title="Opret dig via Google. IQ96.dk modtager kun email, profilbillede og navn fra Google">
          <Paper>
            <div
              style={{
                paddingTop: 5,
                paddingLeft: 5,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <p>Google</p>
            </div>
            <div
              style={{
                margin: 5,
                paddingBottom: 10,
              }}
            >
              <Button classes={chubbyStyles} onClick={handleLoginGoogle}>
                {signingUp ? 'Tilmeld via Google' : 'Login via Google'}
              </Button>
            </div>
          </Paper>
        </Tooltip>
      </div>
      {!isEmptyObject(errorMessage) && (
        <Snackbar severity="error">
          {errorMessage?.email ||
            errorMessage?.password ||
            errorMessage?.facebook ||
            errorMessage?.google ||
            errorMessage?.repeatPassword ||
            errorMessage?.quiz}
        </Snackbar>
      )}
    </div>
  );
}
