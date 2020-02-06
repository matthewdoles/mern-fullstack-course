import React from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';

const PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most iconic skyscrpers in the world',
    image:'https://media.timeout.com/images/101705309/630/472/image.jpg',
    address: '20 W 34th St, New York, NY 10001',
    location: {
      lat: 40.7484405,
      lng: -73.9856644
    },
    creator: 'u1'
  },
  {
    id: 'p2',
    title: 'Empire State Building',
    description: 'One of the most iconic skyscrpers in the world',
    image:'https://media.timeout.com/images/101705309/630/472/image.jpg',
    address: '20 W 34th St, New York, NY 10001',
    location: {
      lat: 40.7484405,
      long: -73.9856644
    },
    creator: 'u2'
  }
];

const UserPlaces = () => {
  const userId = useParams().userId;
  const filteredPlaces = PLACES.filter(place => place.creator === userId);
  return <PlaceList items={filteredPlaces} />;
};

export default UserPlaces;
