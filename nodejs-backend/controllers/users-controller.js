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

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid input, please check your data', 422)
    );
  }

  const { name, email, password, places } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return next(
      new HttpError('Signup failed, please try again.', 500)
    );
  }
  if (existingUser) {
    return next(
      new HttpError('User already associated with that email, please login.', 422)
    );
  }

  const newUser = new User({
    name,
    email,
    image: 'https://avatars1.githubusercontent.com/u/38084552?s=460&v=4',
    password,
    places
  })

  try {
    await newUser.save();
  } catch (error) {
    return next(
      new HttpError('Unalbe to signup, please check try again.', 500)
    );
  }

  res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

const login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid input, please check your data', 422);
  }

  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find(u => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError('Could not idnetify user', 401);
  }

  res.json({ message: 'Logged in!' });
};

module.exports = {
  getUsers,
  signup,
  login
};
