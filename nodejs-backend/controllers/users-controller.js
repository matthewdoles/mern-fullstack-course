const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Matthew Doles',
    email: 'test@test.com',
    password: 'test'
  }
];

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (error) {
    return next(new HttpError('Cannot retrieve users, please try again.', 500));
  }

  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input, please check your data', 422));
  }

  const { name, email, password, places } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return next(new HttpError('Signup failed, please try again.', 500));
  }

  if (existingUser) {
    return next(
      new HttpError(
        'User already associated with that email, please login.',
        422
      )
    );
  }

  const newUser = new User({
    name,
    email,
    image: 'https://avatars1.githubusercontent.com/u/38084552?s=460&v=4',
    password,
    places
  });

  try {
    await newUser.save();
  } catch (error) {
    return next(
      new HttpError('Unalbe to signup, please check try again.', 500)
    );
  }

  res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid input, please check your data', 422);
  }

  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return next(new HttpError('Login failed, please try again.', 500));
  }

  if (!existingUser || existingUser.password !== password) {
    return next(new HttpError('Invalid credentials, please try again.', 401));
  }

  res.json({ message: 'Logged in!' });
};

module.exports = {
  getUsers,
  signup,
  login
};
