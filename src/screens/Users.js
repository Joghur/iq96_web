import { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Table from '../components/Tables';
import { dateEpochToDateString } from '../utils/dates';
import { removeSpaces } from '../utils/strings';
import { PDFViewer } from '@react-pdf/renderer';
// import './App.css';

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
      }
    }
  }
`;

export const Users = () => {
  const allUsers = useQuery(ALL_USERS, {
    fetchPolicy: 'cache-first',
  });
  const [active, setActive] = useState(true);
  const headCells = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Navn' },
    { id: 'username', numeric: false, disablePadding: false, label: 'IQ-navn' },
    { id: 'address', numeric: false, disablePadding: false, label: 'Adresse' },
    // { id: 'work', numeric: false, disablePadding: false, label: 'Arbejde' },
    { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
    // {
    //   id: 'workemail',
    //   numeric: false,
    //   disablePadding: false,
    //   label: 'Arbejds Email',
    // },
    { id: 'phone', numeric: false, disablePadding: false, label: 'Telefon' },
    // { id: 'mobile', numeric: false, disablePadding: false, label: 'Mobil' },
    // {
    //   id: 'workphone',
    //   numeric: false,
    //   disablePadding: false,
    //   label: 'Arbejds Telefon',
    // },
    // {
    //   id: 'size',
    //   numeric: false,
    //   disablePadding: false,
    //   label: 'T-shirt størrelse',
    // },
    // {
    //   id: 'birthday',
    //   numeric: false,
    //   disablePadding: false,
    //   label: 'Fødselsdag',
    // },
  ];

  // todo: make it possible to select columns
  let tabelArray;
  if (allUsers.data) {
    // console.log('data --------------', data);
    tabelArray = allUsers.data.allUsers?.users
      .filter(user => {
        return user.active;
      })
      .map(row => {
        const phones = row.mobile ? row.mobile : row.phone;
        return {
          ...row,
          address: row.address.replace(/,/g, ', '),
          phone: removeSpaces(phones),
        };
      });
    // .map(row => {
    //   return {
    //     ...row,
    //     address: row.address.replace(/,/g, ', '),
    //     phone: removeSpaces(row.phone),
    //     mobile: removeSpaces(row.mobile),
    //     workphone: removeSpaces(row.workphone),
    //     birthday: dateEpochToDateString(row.birthday, 'YYYY/MM/DD'),
    //   };
    // });
  }

  if (allUsers.loading) return <div>Henter Med-Lemmer...</div>;
  if (allUsers.error) return <div>`Fejl! ${allUsers.error.message} `</div>;
  return (
    <>
      {allUsers.data && (
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
