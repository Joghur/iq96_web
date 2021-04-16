import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Snackbar from '../../components/Snackbar';
import { dateEpochToDateString, dateStringToEpoch } from '../../utils/dates';
import {
  TextField,
  Tooltip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
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

  const [user, setUser] = useState();
  // const [roles, setRoles] = useState([]);
  // const [roles, setRoles] = useState([]);
  const [didChange, setDidChange] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});

  useEffect(() => {
    setUser(userQuery.data?.user?.user);
  }, [userQuery]);

  // useEffect(() => {
  //   setRoles(
  //     rolesQuery?.data?.allRoles?.roles.map(item => {
  //       return item.role;
  //     }),
  //   );
  // }, [rolesQuery]);

  if (userQuery.loading) return <div>Henter Med-Lem...</div>;
  if (userQuery.error)
    return (
      <Snackbar severity="error">
        Kunne ikke hente Med-Lem. Netværksproblem?
      </Snackbar>
    );
  if (userQuery.data?.user?.errors)
    return <Snackbar severity="error">Kunne ikke finde Med-Lem</Snackbar>;

  // console.log(
  //   'rolesQuery?.data?.allRoles?.roles',
  //   rolesQuery?.data?.allRoles?.roles,
  // );
  console.log('user', user);
  console.log('error', error);
  console.log('errorMessage', errorMessage);

  // Handles all changes
  const handleChange = (event, secondParam) => {
    let isError = false;
    let id = event?.target?.id;
    let value = event?.target?.value;
    let name = event?.target?.name;

    // console.log('event', event);
    // console.log(' typeof event', typeof event);
    // console.log('event?.constructor?.name', event?.constructor?.name);
    // console.log('secondParam', secondParam);
    // console.log('typeof changedValue', typeof changedValue);

    // From select titles comes an array (roles) and id is something like
    // roles-option-1. We only need roles text for the key in "user".
    // From t-shirt size comes an object with key "value"
    if (secondParam && typeof secondParam === 'object') {
      // console.log('changedValue?.value', secondParam?.props?.value);
      // console.log('changedValue?.value', secondParam);
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

    const validated = validate(id, value);

    // console.log('id', id);
    // console.log('validated', validated);

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
      <BackButton />
      {didChange && <p>Changed</p>}
      {user && (
        <div className={classes.root}>
          <div>
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
