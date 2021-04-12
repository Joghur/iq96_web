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
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PeopleIcon from '@material-ui/icons/People';
import Header from './components/Header';
import { Pdfs } from './components/Pdfs';
import { Users } from './screens/Users';
import { SignIn } from './screens/SignIn';
import { IFRAME_URL } from './constants';

const drawerWidth = 240;

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
      marginLeft: 0,
    },
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
      <List>
        {[
          { name: 'Signin', to: '/signin', icon: <InboxIcon /> },
          { name: 'Med-Lemmer', to: '/users', icon: <PeopleIcon /> },
          { name: 'Breve', to: '/letters', icon: <EmailIcon /> },
        ].map((listObj, index) => (
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
      <iframe width="1165" height="1165" title="iframe" src={IFRAME_URL} />
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
              <Route path="/signin" component={SignIn} />
              <Route path="/letters" component={Pdfs} />
              <Route path="/old_site" component={OldSite} />
            </main>
          </div>
        </main>
      </Router>
    </div>
  );
}

export default App;
