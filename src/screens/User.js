import { useParams } from 'react-router-dom';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Snackbar from '../components/Snackbar';
import { dateEpochToDateString } from '../utils/dates';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

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
        birthday
        email
        phone
        mobile
        work
        workemail
        workphone
        size
        roles {
          role
        }
      }
    }
  }
`;

export const User = () => {
  let { id } = useParams();

  const history = useHistory();

  const userQuery = useQuery(USER, {
    variables: { id: parseInt(id) },
    fetchPolicy: 'cache-first',
  });

  if (userQuery.loading) return <div>Henter Med-Lem...</div>;
  if (userQuery.error)
    return (
      <Snackbar severity="error">
        Kunne ikke hente Med-Lem. Netværksproblem?
      </Snackbar>
    );
  if (userQuery.data?.user?.errors)
    return <Snackbar severity="error">Kunne ikke finde Med-Lem</Snackbar>;

  const user = userQuery.data?.user?.user;

  return (
    <div>
      <Button variant="contained" onClick={() => history.goBack()}>
        Tilbage
      </Button>
      {user && (
        <div>
          <h3>Navn: {user.name}</h3>
          <h3>IQ navn: {user.username}</h3>
          <h3>
            birthday: {dateEpochToDateString(user.birthday, 'DD/MM-YYYY')}
          </h3>
          <h3>Email: {user.email}</h3>
          <h3>Hjemmetelefon: {user.phone}</h3>
          <h3>Mobil: {user.mobile}</h3>
          <h3>Arbejde: {user.work}</h3>
          <h3>Arbejdsmail: {user.workemail}</h3>
          <h3>Arbejdstelefon: {user.workphone}</h3>
          <h3>T-shirt størrelse: {user.size}</h3>
          <h3>
            Roller:{' '}
            {user.roles.length > 0 &&
              user.roles
                .map(item => {
                  return item.role;
                })
                .join(', ')}
          </h3>
        </div>
      )}
    </div>
  );
};
