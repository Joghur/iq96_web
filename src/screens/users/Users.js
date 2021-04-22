import { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Table from '../../components/Tables';
import { removeSpaces } from '../../utils/strings';
import Snackbar from '../../components/Snackbar';

const ALL_USERS = gql`
  query allUsers {
    allUsers {
      users {
        id
        name
        active
        username
        email
        phone
        mobile
        address
        roles {
          role
        }
      }
    }
  }
`;

export const Users = () => {
  const allUsers = useQuery(ALL_USERS, {
    fetchPolicy: 'cache-and-network',
  });
  const [active, setActive] = useState(true);

  useEffect(() => {
    allUsers.refetch();
  }, []);

  const headCells = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Navn' },
    { id: 'username', numeric: false, disablePadding: false, label: 'IQ-navn' },
    { id: 'role', numeric: false, disablePadding: false, label: 'Rolle' },
    { id: 'address', numeric: false, disablePadding: false, label: 'Adresse' },
    { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
    {
      id: 'phone',
      numeric: false,
      disablePadding: false,
      label: 'Telefon (mobil først)',
    },
  ];

  // todo: make it possible to select columns
  let tabelArray;
  if (allUsers.data) {
    tabelArray = allUsers.data.allUsers?.users
      .filter(user => {
        return user.active;
      })
      .map(row => {
        const phones = row.mobile ? row.mobile : row.phone;
        return {
          ...row,
          role: row.roles.map(item => item.role).join(', '),
          address: row.address.replace(/,/g, ', '),
          phone: removeSpaces(phones),
        };
      });
  }

  if (allUsers.loading) return <div>Henter Med-Lemmer...</div>;
  if (allUsers.error || !allUsers.data?.allUsers)
    return (
      <Snackbar severity="error">Kunne ikke hente Med-Lems liste</Snackbar>
    );
  console.log('allUsers.data', allUsers.data);
  return (
    <>
      {allUsers.data?.allUsers && (
        <>
          <Table
            title={`IQ96 Med-Lemmer (${tabelArray.length})`}
            tabelArray={tabelArray}
            headCells={headCells}
            startRowsPerPage={15}
            showPagination={true}
            rowsPerPageOptions={[
              15,
              17,
              19,
              21,
              { value: tabelArray.length, label: 'Alle' },
            ]}
          />
        </>
      )}
    </>
  );
};
