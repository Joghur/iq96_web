import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Table from '../components/Tables';
import { dateEpochToDateString } from '../utils/dates';
import { removeSpaces } from '../utils/strings';

const ALL_USERS = gql`
  query allUsers {
    allUsers {
      users {
        id
        name
        active
        username
        work
        email
        workemail
        phone
        mobile
        workphone
        address
        birthday
        size
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
    { id: 'address', numeric: false, disablePadding: false, label: 'Adresse' },
    { id: 'work', numeric: false, disablePadding: false, label: 'Arbejde' },
    { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
    {
      id: 'workemail',
      numeric: false,
      disablePadding: false,
      label: 'Arbejds Email',
    },
    { id: 'phone', numeric: false, disablePadding: false, label: 'Telefon' },
    { id: 'mobile', numeric: false, disablePadding: false, label: 'Mobil' },
    {
      id: 'workphone',
      numeric: false,
      disablePadding: false,
      label: 'Arbejds Telefon',
    },
    {
      id: 'size',
      numeric: false,
      disablePadding: false,
      label: 'T-shirt størrelse',
    },
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
    tabelArray = data.allUsers?.users
      .filter(user => {
        return user.active;
      })
      .map(row => {
        return {
          ...row,
          address: row.address.replace(/,/g, ', '),
          phone: removeSpaces(row.phone),
          mobile: removeSpaces(row.mobile),
          workphone: removeSpaces(row.workphone),
          birthday: dateEpochToDateString(row.birthday, 'YYYY/MM/DD'),
        };
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
