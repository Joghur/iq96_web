import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client';
import Snackbar from '../../components/Snackbar';
import { dateEpochToDateString, dateStringToEpoch } from '../../utils/dates';
import {
  TextField,
  Tooltip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Switch,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useHistory } from 'react-router-dom';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { BackButton } from '../../components/BackButton';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker } from '@material-ui/pickers';
import validate from '../../utils/validate';

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
  rolesRoot: {
    marginLeft: 8,
    width: 500,
    '& > * + *': {
      marginTop: theme.spacing(3),
    },
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const IOSSwitch = withStyles(theme => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#52d869',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

const USER = gql`
  query user($id: Int!) {
    user(id: $id) {
      errors {
        field
        message
      }
      user {
        id
        active
        name
        username
        address
        birthday
        email
        phone
        mobile
        work
        workemail
        workphone
        size
        roles {
          id
          role
        }
      }
    }
  }
`;

const ROLES = gql`
  query allRoles {
    allRoles {
      roles {
        id
        role
      }
    }
  }
`;

const UPDATE_USER = gql`
  mutation updateUser(
    $id: Int!
    $active: Boolean!
    $name: String!
    $username: String!
    $birthday: String!
    $address: String!
    $email: String!
    $phone: String!
    $mobile: String!
    $work: String!
    $workemail: String!
    $workphone: String!
    $size: String!
  ) {
    updateUser(
      id: $id
      active: $active
      name: $name
      username: $username
      birthday: $birthday
      address: $address
      email: $email
      phone: $phone
      mobile: $mobile
      work: $work
      workemail: $workemail
      workphone: $workphone
      size: $size
    ) {
      id
    }
  }
`;

const DELETE_USER = gql`
  mutation deleteUser($id: Int!) {
    deleteUser(id: $id)
  }
`;

export const User = () => {
  const classes = useStyles();
  let { id } = useParams();

  const history = useHistory();

  const userQuery = useQuery(USER, {
    variables: { id: parseInt(id) },
    fetchPolicy: 'cache-first',
  });
  const rolesQuery = useQuery(ROLES, {
    fetchPolicy: 'cache-first',
  });
  const [updateUser, { data }] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);

  const [user, setUser] = useState();
  const [didChange, setDidChange] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [openDialog, setOpenDialog] = React.useState(false);

  useEffect(() => {
    setUser(userQuery.data?.user?.user);
  }, [userQuery]);

  useEffect(() => {
    userQuery.refetch();
  }, []);

  if (userQuery.loading) return <div>Henter Med-Lem...</div>;
  if (userQuery.error)
    return (
      <Snackbar severity="error">
        Kunne ikke hente Med-Lem. Netværksproblem?
      </Snackbar>
    );
  if (userQuery.data?.user?.errors)
    return <Snackbar severity="error">Kunne ikke finde Med-Lem</Snackbar>;

  console.log('user', user);
  // console.log('data', data?.updateUser?.id);
  // console.log('error', error);
  // console.log('errorMessage', errorMessage);
  console.log('deleteUser.data', deleteUser.data);

  // Handles all changes
  const handleChange = (event, secondParam) => {
    let isError = false;
    let id = event?.target?.id;
    let value = event?.target?.value;
    let name = event?.target?.name;
    let checked = event?.target?.checked;

    console.log('event', event);
    console.log('event.target', event?.target);
    console.log('id', id);
    console.log('checked', checked);
    console.log('name', name);
    // console.log(' typeof event', typeof event);
    // console.log('event?.constructor?.name', event?.constructor?.name);
    console.log('secondParam', secondParam);
    // console.log('typeof secondParam', typeof secondParam);
    // console.log('secondParam?.value', secondParam?.props?.value);
    // console.log('secondParam?.value', secondParam);

    // From select titles comes an array (roles) and id is something like
    // roles-option-1. We only need roles text for the key in "user".
    // From t-shirt size comes an object with key "value"
    if (secondParam && typeof secondParam === 'object') {
      if (name) {
        id = name; // this input control uses name instead of id
        value = secondParam.props?.value;
      } else {
        id = id.split('-')[0];
        value = secondParam;
      }
    }

    // birthday needs converting from date to epoch milliseconds
    // event is a Date object and secondParam is date in string format chosen by Datepicker
    if (event?.constructor?.name === 'Date') {
      id = 'birthday';
      // console.log('dateStringToEpoch(value)', dateStringToEpoch(secondParam));
      value = dateStringToEpoch(secondParam);
    }

    // active member switch
    if (name === 'active') {
      id = name;
      value = checked;
    }

    const validated = validate(id, value);

    console.log('validated', validated);

    // if something is not validated exit function and set error states
    if (validated.errorMessage) {
      setErrorMessage({ [id]: validated.errorMessage });
      setError(true);
    } else {
      // if everything is validated correctly continue with setting user states
      setErrorMessage({});
      setError(false);
    }

    setDidChange(true);

    // insert new values in user object
    setUser(user => {
      return { ...user, [id]: validated.value };
    });
  };

  return (
    <div>
      <div>
        <BackButton />
        <Button
          variant="contained"
          color="primary"
          style={{ marginLeft: 10 }}
          onClick={e => {
            e.preventDefault();
            setOpenDialog(true);
          }}
        >
          Fjern
        </Button>
        <Dialog
          open={openDialog}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setOpenDialog(false)}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle
            id="alert-dialog-slide-title"
            className={classes.errorColor}
          >
            {'ADVARSEL!! Slet Med-Lem?'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Du er ved at slette et Med-Lem. Dette skal kun gøres hvis der er
              oprettet en bruger ved en fejl. Tidligere Med-Lemmer skal gøres
              inaktive ved at benytte "Nuværende Med-Lem" kontakten!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Det var en fejl jeg trykkede på Fjern knappen
            </Button>
            <Button
              onClick={e => {
                e.preventDefault();
                deleteUser({
                  variables: {
                    id: user.id,
                  },
                });
                history.goBack();
              }}
              className={classes.errorColor}
            >
              Slet Med-Lemmet
            </Button>
          </DialogActions>
        </Dialog>
        {didChange && (
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: 10 }}
            onClick={e => {
              e.preventDefault();
              updateUser({
                variables: {
                  id: user.id,
                  active: user.active,
                  name: user.name,
                  username: user.username,
                  birthday: dateEpochToDateString(user.birthday, 'yyyy-MM-DD'),
                  address: user.address,
                  email: user.email,
                  phone: user.phone,
                  mobile: user.mobile,
                  work: user.work,
                  workemail: user.workemail,
                  workphone: user.workphone,
                  size: user.size,
                  // roles: user.roles.map(role => role.id),
                },
              });
              history.goBack();
            }}
          >
            Opdatér
          </Button>
        )}
      </div>
      {user && (
        <div className={classes.root}>
          <div>
            <div>
              <FormControlLabel
                control={
                  <IOSSwitch
                    checked={user.active}
                    onChange={handleChange}
                    name="active"
                  />
                }
                label="Nuværende Med-Lem"
              />
            </div>
            <TextField
              id="name"
              label="Navn"
              error={!!errorMessage.name}
              value={user.name}
              className={classes.textFieldLarger}
              margin="dense"
              onChange={handleChange}
              variant="outlined"
              helperText={errorMessage.name && errorMessage.name}
            />
            <TextField
              id="username"
              label="IQ navn"
              error={!!errorMessage.username}
              value={user.username}
              className={classes.textField}
              margin="dense"
              onChange={handleChange}
              variant="outlined"
              helperText={errorMessage.username && errorMessage.username}
            />
            <TextField
              id="address"
              label="Adresse"
              error={!!errorMessage.address}
              value={user.address}
              className={classes.textFieldLarger}
              margin="dense"
              onChange={handleChange}
              variant="outlined"
              helperText={errorMessage.address && errorMessage.address}
            />
            <TextField
              id="email"
              label="Email"
              error={!!errorMessage.email}
              value={user.email}
              margin="dense"
              className={classes.textFieldLarger}
              onChange={handleChange}
              variant="outlined"
              helperText={errorMessage.email && errorMessage.email}
            />
            <TextField
              id="workemail"
              label="Arbejdsmail"
              value={user.workemail}
              error={!!errorMessage.workemail}
              className={classes.textFieldLarger}
              margin="dense"
              onChange={handleChange}
              variant="outlined"
              helperText={errorMessage.workemail && errorMessage.workemail}
            />
            <TextField
              id="phone"
              label="Hjemmetelefon"
              value={user.phone}
              error={!!errorMessage.phone}
              className={classes.textField}
              margin="dense"
              onChange={handleChange}
              variant="outlined"
              helperText={errorMessage.phone && errorMessage.phone}
            />
            <TextField
              id="mobile"
              label="Mobil"
              value={user.mobile}
              error={!!errorMessage.mobile}
              className={classes.textField}
              margin="dense"
              onChange={handleChange}
              variant="outlined"
              helperText={errorMessage.mobile && errorMessage.mobile}
            />
            <TextField
              id="workphone"
              label="Arbejdstelefon"
              value={user.workphone}
              error={!!errorMessage.workphone}
              className={classes.textField}
              margin="dense"
              onChange={handleChange}
              variant="outlined"
              helperText={errorMessage.workphone && errorMessage.workphone}
            />
            <TextField
              id="work"
              label="Arbejde"
              value={user.work}
              error={!!errorMessage.work}
              className={classes.textField}
              margin="dense"
              onChange={handleChange}
              variant="outlined"
              helperText={errorMessage.work && errorMessage.work}
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                id="birthday"
                label="Vælg fødseldag"
                format="d/M-y"
                margin="dense"
                variant="inline"
                inputVariant="outlined"
                className={classes.textField}
                value={dateEpochToDateString(user.birthday)}
                initialFocusedDate="1970-1-1"
                onChange={handleChange}
                animateYearScrolling
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
            <FormControl
              name="size"
              variant="outlined"
              className={classes.textField}
              style={{ marginTop: 8 }}
              margin="dense"
            >
              <InputLabel>T-Shirt størrelse</InputLabel>
              <Select
                name="size"
                value={user.size}
                onChange={handleChange}
                label="Størrelse"
              >
                <MenuItem value="">
                  <em>Ingen</em>
                </MenuItem>
                <MenuItem value={'S'}>S</MenuItem>
                <MenuItem value={'M'}>M</MenuItem>
                <MenuItem value={'L'}>L</MenuItem>
                <MenuItem value={'XL'}>XL</MenuItem>
                <MenuItem value={'XXL'}>XXL</MenuItem>
                <MenuItem value={'XXXL'}>XXXL</MenuItem>
              </Select>
            </FormControl>
            {rolesQuery?.data?.allRoles?.roles && (
              <Tooltip title="Tryk på tekst for at vælge ny titel. Slet gammel ved at trykke på kryds">
                <Autocomplete
                  multiple
                  id="roles"
                  options={rolesQuery?.data?.allRoles?.roles}
                  getOptionLabel={option => {
                    return option.role;
                  }}
                  defaultValue={[...user.roles]}
                  className={classes.textFieldLarger}
                  style={{ marginTop: 8 }}
                  onChange={handleChange}
                  renderInput={params => {
                    return (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Titler"
                        placeholder="Vælg ny titel"
                      />
                    );
                  }}
                />
              </Tooltip>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
