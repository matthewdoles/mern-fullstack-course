const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');

let DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most iconic skyscrpers in the world',
    image: 'https://media.timeout.com/images/101705309/630/472/image.jpg',
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
    image: 'https://media.timeout.com/images/101705309/630/472/image.jpg',
    address: '20 W 34th St, New York, NY 10001',
    location: {
      lat: 40.7484405,
      long: -73.9856644
    },
    creator: 'u1'
  }
];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError('Trouble retrieving a place.', 500));
  }

  if (!place) {
    return next(
      new HttpError('Could not find a place with the provided id.', 404)
    );
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (error) {
    return next(new HttpError('Trouble retrieving user places.', 500));
  }

  if (places.length === 0) {
    return next(
      new HttpError('Could not find any places with the provided user id.', 404)
    );
  }

  res.json({ places: places.map(place => place.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpErrpr('Invalid input, please check your data.', 422));
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const newPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: 'https://media.timeout.com/images/101705309/630/472/image.jpg',
    creator
  });

  try {
    await newPlace.save();
  } catch (error) {
    return next(
      new HttpError('Unalbe to save place, please check try again.', 500)
    );
  }

  res.status(200).json({ place: newPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next( new HttpError('Invalid input, please check your data', 422));
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError('Trouble retrieving a place.', 500));
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (error) {
    return next(
      new HttpError('Unalbe to update place, please check try again.', 500)
    );
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError('Trouble retrieving a place.', 500));
  }

  try {
    place.remove();
  } catch (error) {
    return next(
      new HttpError('Unalbe to remove place, please try again.', 500)
    );
  }

  res.status(200).json({ message: 'Deleted place.' });
};

module.exports = {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace
};
