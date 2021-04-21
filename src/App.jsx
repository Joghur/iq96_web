/* eslint-disable react/no-array-index-key */
/* eslint-disable import/named */

import { useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { BrowserRouter as Router, NavLink, Route } from 'react-router-dom';
import EmailIcon from '@material-ui/icons/Email';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PeopleIcon from '@material-ui/icons/People';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import ListSubheader from '@material-ui/core/ListSubheader';
import SubjectIcon from '@material-ui/icons/Subject';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import GavelIcon from '@material-ui/icons/Gavel';
import AirplanemodeActiveIcon from '@material-ui/icons/AirplanemodeActive';
import SportsKabaddiIcon from '@material-ui/icons/SportsKabaddi';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import Header from './components/Header';
import { Users } from './screens/users/Users';
import { User } from './screens/users/User';
import { Board } from './screens/users/Board';
import { Titles } from './screens/users/Titles';
import { SignIn } from './screens/SignIn';
import { Annals } from './screens/library/Annals';
import { Summary } from './screens/library/Summary';
import { Song } from './screens/library/Song';
import { Laws } from './screens/library/Laws';
import { PreviousTours } from './screens/library/PreviousTours';
import { Letters } from './screens/library/Letters';
import { IFRAME_URL } from './constants';
import { PrivateRoute } from './components/PrivateRoute';
import { Login } from './components/Login';
import { auth } from './utils/firebase';
import Snackbar from './components/Snackbar';

const drawerWidth = 240;
const usersMenuItems = [
  { name: 'Med-Lemmer', to: '/users', icon: <PeopleIcon /> },
  { name: 'Bestyrelsen', to: '/board', icon: <SportsKabaddiIcon /> },
  { name: 'Titler', to: '/titles', icon: <EmojiEventsIcon /> },
];
const mediaMenuItems = [{ name: '---', to: '/letters', icon: <EmailIcon /> }];
const libMenuItems = [
  { name: 'De hellige Annaler', to: '/annals', icon: <MenuBookIcon /> },
  { name: 'GF Referat', to: '/summary', icon: <SubjectIcon /> },
  { name: 'IQ Breve', to: '/letters', icon: <EmailIcon /> },
  { name: 'IQ Sangen', to: '/song', icon: <LibraryMusicIcon /> },
  { name: 'Love og Vedtægter', to: '/laws', icon: <GavelIcon /> },
  {
    name: 'Tidligere Ture',
    to: '/previous-tours',
    icon: <AirplanemodeActiveIcon />,
  },
];

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  links: {
    color: 'white',
    textDecoration: 'none',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  noAppBar: {
    [theme.breakpoints.up('sm')]: {
      width: '100%',
    },
  },
  iframes: {
    display: 'flex',
    justifyContent: 'center',
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function App() {
  // const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const pdfOnlyMode = params.get('pdfonly');
  const pdfToken = params.get('pdftoken');

  useEffect(() => {
    auth().onAuthStateChanged(async user => {
      if (user) {
        // console.log('auth().curren', await auth().currentUser.getIdToken());
        // console.log('user.displayName', user.displayName);
        // // console.log('User.getToken()', User.getToken());
        // console.log('user.email', user.email);
        // console.log('user.photoURL', user.photoURL);
        // console.log('user.emailVerified', user.emailVerified);
        // console.log('user.uid', user.uid);
        // user.providerData.forEach(function (profile) {
        //   console.log(`Sign-in provider: ${profile.providerId}`);
        //   console.log(`  Provider-specific UID: ${profile.uid}`);
        //   console.log(`  Name: ${profile.displayName}`);
        //   console.log(`  Email: ${profile.email}`);
        //   console.log(`  Photo URL: ${profile.photoURL}`);
        // });

        const _token = await auth().currentUser.getIdToken();
        localStorage.setItem('auth_token', _token);
        setAuthenticated(true);
        setLoading(false);
      } else {
        setAuthenticated(false);
        setLoading(false);
      }
    });
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <ListSubheader>Med-Lemmer</ListSubheader>
      <List>
        {usersMenuItems.map((listObj, index) => (
          <ListItem button key={index} component={NavLink} to={listObj.to}>
            <ListItemIcon>{listObj.icon}</ListItemIcon>
            <ListItemText primary={listObj.name} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <ListSubheader>Bibliotek</ListSubheader>
      <List>
        {libMenuItems.map((listObj, index) => (
          <ListItem button key={index} component={NavLink} to={listObj.to}>
            <ListItemIcon>{listObj.icon}</ListItemIcon>
            <ListItemText primary={listObj.name} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <ListSubheader>Media</ListSubheader>
      <List>
        {mediaMenuItems.map((listObj, index) => (
          <ListItem button key={index} component={NavLink} to={listObj.to}>
            <ListItemIcon>{listObj.icon}</ListItemIcon>
            <ListItemText primary={listObj.name} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  const OldSite = () => {
    return (
      <>
        <div className={classes.iframes}>
          <iframe width="1165" height="1165" title="iframe" src={IFRAME_URL} />
        </div>
      </>
    );
  };

  if (loading) {
    return <Snackbar severity="info">Henter....</Snackbar>;
  }

  console.log('authenticated', authenticated);
  console.log('pdfToken', pdfToken);

  return (
    <div className={classes.root}>
      <Router>
        <CssBaseline />
        {!pdfOnlyMode && (
          <AppBar
            position="fixed"
            className={!mobileOpen ? classes.noAppBar : classes.appBar}
          >
            <Header
              handleDrawerToggle={handleDrawerToggle}
              mobileOpen={mobileOpen}
            />
          </AppBar>
        )}
        <>
          {mobileOpen && (
            <nav className={classes.drawer} aria-label="mailbox folders">
              {!pdfOnlyMode && (
                <Hidden smUp implementation="css">
                  <Drawer
                    // container={container}
                    variant="temporary"
                    anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    classes={{
                      paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                      keepMounted: true, // Better open performance on mobile.
                    }}
                  >
                    {drawer}
                  </Drawer>
                </Hidden>
              )}
            </nav>
          )}
        </>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <div>
            <main>
              <Route exact path="/" component={OldSite} />
              <Route path="/login" component={Login} />
              <PrivateRoute
                path="/users"
                authenticated={authenticated}
                pdf={pdfToken}
              >
                <Users />
              </PrivateRoute>
              <PrivateRoute path="/user/:id" authenticated={authenticated}>
                <User />
              </PrivateRoute>
              <PrivateRoute path="/board" authenticated={authenticated}>
                <Board />
              </PrivateRoute>
              <PrivateRoute path="/titles" authenticated={authenticated}>
                <Titles />
              </PrivateRoute>
              <PrivateRoute path="/signin" authenticated={authenticated}>
                <SignIn />
              </PrivateRoute>
              <PrivateRoute path="/annals" authenticated={authenticated}>
                <Annals />
              </PrivateRoute>
              <PrivateRoute path="/summary" authenticated={authenticated}>
                <Summary />
              </PrivateRoute>
              <PrivateRoute path="/letters" authenticated={authenticated}>
                <Letters />
              </PrivateRoute>
              <PrivateRoute path="/song" authenticated={authenticated}>
                <Song />
              </PrivateRoute>
              <PrivateRoute path="/laws" authenticated={authenticated}>
                <Laws />
              </PrivateRoute>
              <PrivateRoute
                path="/previous-tours"
                authenticated={authenticated}
              >
                <PreviousTours />
              </PrivateRoute>
            </main>
          </div>
        </main>
      </Router>
    </div>
  );
}

export default App;
