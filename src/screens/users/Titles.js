import { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Table from '../../components/Tables';
import Snackbar from '../../components/Snackbar';

const FOR_ALL_TITLES = gql`
  query allUsers {
    allUsers {
      users {
        id
        active
        username
        roles {
          role
        }
      }
    }
  }
`;

export const Titles = () => {
  const allUsers = useQuery(FOR_ALL_TITLES, {
    fetchPolicy: 'cache-first',
  });
  const [active, setActive] = useState(true);
  const headCells = [
    {
      id: 'role',
      numeric: false,
      disablePadding: false,
      label: 'Titel',
    },
    { id: 'username', numeric: false, disablePadding: false, label: 'IQ-navn' },
  ];

  // todo: make it possible to select columns
  const titles = [
    'Formand',
    'Næstformand',
    'Kasserer',
    'Bestyrelsesmed-lem',
    'Bestyrelsesmed-lemssuppleant',
    'Revisor',
    'Revisorsuppleant',
  ];
  let tabelArray;

  if (allUsers.data) {
    tabelArray = allUsers.data.allUsers?.users
      .filter(user => {
        return (
          user.active &&
          // checking if user role is in list of titles
          user.roles.some(item => {
            return titles.includes(item.role);
          })
        );
      })
      .map(row => {
        return {
          ...row,
          role: row.roles.map((item, index) => {
            // Using that board roles comes before other roles (like admin), and so
            // only index 0 is needed
            if (index === 0) return item.role;
          }),
        };
      });
  }

  if (allUsers.loading) return <div>Henter Titler...</div>;
  if (allUsers.error)
    return <Snackbar severity="error">Kunne ikke hente Titler</Snackbar>;

  return (
    <>
      {allUsers.data && (
        <Table
          title={'Valgbare Titler'}
          tabelArray={tabelArray}
          headCells={headCells}
          startRowsPerPage={tabelArray.length}
          showPagination={false}
        />
      )}
    </>
  );
};
