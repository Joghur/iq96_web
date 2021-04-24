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
import { IFRAME_URL, IFRAME_COUNTDOWN } from './constants';
import { PrivateRoute } from './components/PrivateRoute';
import { Login } from './components/Login';
import LoginValidation from './screens/LoginValidation';
import Snackbar from './components/Snackbar';
import { auth } from './utils/firebase';
import { userState } from './Recoil';
import { useRecoilState } from 'recoil';

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
    paddingRight: 600,
    // justifyContent: 'center',
    // alignItems: 'center',
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

function Routing() {
  // material-ui
  const classes = useStyles();
  const theme = useTheme();

  // react
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // recoil
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    let savedUser = JSON.parse(localStorage.getItem('user'));
    console.log('savedUser 987', savedUser);
    console.log('typeof savedUser 988', typeof savedUser);
    if (typeof savedUser !== 'object') {
      console.log('4545');
      savedUser = {};
    }

    auth().onAuthStateChanged(async _user => {
      // console.log('_user 125', _user);
      console.log('user 126', user);
      if (_user) {
        setAuthenticated(true);
        setLoading(false);

        const userData = {
          displayName: _user.displayName,
          email: _user.email,
          firebaseUid: _user.uid,
          token: await auth().currentUser.getIdToken(),
        };
        console.log('...savedUser 1', { ...savedUser });
        console.log('...userData 1', { ...userData });
        setUser(oldUser => ({ ...oldUser, ...savedUser, ...userData }));
        setTimeout(() => {
          console.log('user 127', user);
          localStorage.setItem('user', JSON.stringify(user));
        }, 300);
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
          <iframe
            width="100%"
            height="100%"
            title="iframe"
            src={IFRAME_COUNTDOWN}
          />
        </div>
        <div className={classes.iframes}>
          <iframe width="1165" height="1165" title="iframe" src={IFRAME_URL} />
        </div>
      </>
    );
  };

  if (loading) {
    return <Snackbar severity="info">Henter....</Snackbar>;
  }

  console.log('authenticated 548', authenticated);

  return (
    <div className={classes.root}>
      <Router>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={!mobileOpen ? classes.noAppBar : classes.appBar}
        >
          <Header
            handleDrawerToggle={handleDrawerToggle}
            mobileOpen={mobileOpen}
          />
        </AppBar>
        <>
          {mobileOpen && (
            <nav className={classes.drawer} aria-label="mailbox folders">
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
                path="/loginvalidation"
                authenticated={authenticated}
              >
                <LoginValidation />
              </PrivateRoute>
              <PrivateRoute path="/users" authenticated={authenticated}>
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

export default Routing;
