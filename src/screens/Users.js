import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Table from '../components/Tables';

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
        address
        birthday
      }
    }
  }
`;

export const Users = () => {
  const { loading, error, data } = useQuery(ALL_USERS);
  const [active, setActive] = useState(true);

  const headCells = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Navn' },
    { id: 'username', numeric: false, disablePadding: false, label: 'IQ-navn' },
    { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
    { id: 'address', numeric: false, disablePadding: false, label: 'Adresse' },
    {
      id: 'birthday',
      numeric: false,
      disablePadding: false,
      label: 'Fødselsdag',
    },
  ];

  let tabelArray;
  if (data) {
    // console.log('data --------------', data);
    tabelArray = data.allUsers?.users.filter(user => {
      return user.active;
    });
  }

  if (loading) return <div>Henter...</div>;
  if (error) return <div>`Fejl! ${error.message}`</div>;
  return (
    <>
      {data && (
        <Table
          title={'IQ96 Med-Lemmer'}
          tabelArray={tabelArray}
          headCells={headCells}
          startRowsPerPage={10}
          rowsPerPageOptions={[10, 25]}
        />
      )}
    </>
  );
};
