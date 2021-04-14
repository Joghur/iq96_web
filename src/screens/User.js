import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Snackbar from '../components/Snackbar';
import { dateEpochToDateString, dateStringToEpoch } from '../utils/dates';
import { TextField, Tooltip } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { BackButton } from '../components/BackButton';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker } from '@material-ui/pickers';

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
  const [roles, setRoles] = useState([]);
  const [dateBirthday, setDateBirthday] = useState();

  useEffect(() => {
    setUser(userQuery.data?.user?.user);
  }, [userQuery]);

  useEffect(() => {
    setDateBirthday(
      dateEpochToDateString(userQuery.data?.user?.user?.birthday, 'DD/MM-YYYY'),
    );
  }, []);

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
  // console.log('user', user);
  console.log('dateBirthday', dateBirthday);

  // Handles all changes
  const handleChange = (event, roles) => {
    let id = event?.target?.id;
    let value = event?.target?.value;
    console.log('roles', roles);
    console.log('typeof rolesOrDate', typeof rolesOrDate);
    // from select titles comes an array (roles) and id is something like
    // roles-option-1. We only need roles text for the key in "user"
    if (roles && typeof roles === 'object') {
      id = id.split('-')[0];
      value = roles;
    }

    console.log('value1', value);
    // birthday needs converting from date to epoch milliseconds
    if (id === 'birthday') {
      console.log("id === 'birthday'");
      setDateBirthday(value);
      console.log('dateStringToEpoch(value)', dateStringToEpoch(value));
      value = dateStringToEpoch(value);
    }
    console.log('id', id);
    console.log('value2', value);

    // insert new values in user object
    setUser(user => {
      return { ...user, [id]: value };
    });
  };

  return (
    <div>
      <BackButton />
      {user && (
        <div className={classes.root}>
          <div style={{}}>
            <TextField
              id="name"
              label="Navn"
              value={user.name}
              className={classes.textField}
              margin="dense"
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              id="username"
              label="IQ navn"
              value={user.username}
              className={classes.textField}
              margin="dense"
              onChange={handleChange}
              variant="outlined"
            />
            {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                id="birthday"
                label="Vælg fødseldag"
                format="dd/MM-yyyy"
                margin="dense"
                value={dateEpochToDateString(user.birthday, 'DD/MM-YYYY')}
                onChange={handleChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider> */}
            <TextField
              id="birthday"
              label="Fødselsdag"
              value={dateBirthday}
              className={classes.textField}
              margin="dense"
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              id="phone"
              label="Hjemmetelefon"
              value={user.phone}
              className={classes.textField}
              margin="dense"
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              id="mobile"
              label="Mobil"
              value={user.mobile}
              className={classes.textField}
              margin="dense"
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              id="workphone"
              label="Arbejdstelefon"
              value={user.workphone}
              className={classes.textField}
              margin="dense"
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              id="work"
              label="Arbejde"
              value={user.work}
              className={classes.textField}
              margin="dense"
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              id="size"
              label="T-shirt størrelse"
              value={user.size}
              className={classes.textField}
              margin="dense"
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              id="address"
              label="Adresse"
              value={user.address}
              margin="dense"
              style={{ margin: 8 }}
              InputLabelProps={{ shrink: true }}
              fullWidth
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              id="email"
              label="Email"
              value={user.email}
              InputLabelProps={{ shrink: true }}
              margin="dense"
              style={{ margin: 8 }}
              fullWidth
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              id="workemail"
              label="Arbejdsmail"
              value={user.workemail}
              style={{ margin: 8 }}
              fullWidth
              margin="dense"
              onChange={handleChange}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <Tooltip title="Tryk på tekst for at vælge ny titel. Slet gammel ved at trykke på kryds">
              <Autocomplete
                multiple
                id="roles"
                options={rolesQuery?.data?.allRoles?.roles}
                getOptionLabel={option => {
                  return option.role;
                }}
                defaultValue={[...user.roles]}
                style={{ margin: 8 }}
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
          </div>
        </div>
      )}
    </div>
  );
};
