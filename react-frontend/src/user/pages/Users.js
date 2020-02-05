import React from 'react';

import UsersList from '../components/UsersList';

const Users = () => {
  const USERS = [
    {
      id: 'u1',
      name: 'Matthew Doles',
      image: 'https://avatars1.githubusercontent.com/u/38084552?s=460&v=4',
      places: 3
    }
  ];

  return <UsersList items={USERS} />;
};

export default Users;
