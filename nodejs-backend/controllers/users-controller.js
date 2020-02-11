const uuid = require('uuid/v4');
const HttpError = require('../models/http-error');

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

const signup = (req, res, next) => {
  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find(u => u.email === email);
  if(hasUser) {
    throw new HttpError('Email already exists, cannot create user', 422)
  }
  
  const newUser = {
    id: uuid(),
    name,
    email,
    password
  };

  DUMMY_USERS.push(newUser);
  res.status(201).json({ user: newUser });
};

const login = (req, res, next) => {
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
