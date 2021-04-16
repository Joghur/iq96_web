/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { useState } from 'react';
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

  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const pdfOnlyMode = params.get('pdfonly');

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
              <Route path="/users" component={Users} />
              <Route path="/user/:id" component={User} />
              <Route path="/board" component={Board} />
              <Route path="/titles" component={Titles} />
              <Route path="/signin" component={SignIn} />
              <Route path="/old_site" component={OldSite} />
              <Route path="/annals" component={Annals} />
              <Route path="/summary" component={Summary} />
              <Route path="/letters" component={Letters} />
              <Route path="/song" component={Song} />
              <Route path="/laws" component={Laws} />
              <Route path="/previous-tours" component={PreviousTours} />
            </main>
          </div>
        </main>
      </Router>
    </div>
  );
}

export default App;
