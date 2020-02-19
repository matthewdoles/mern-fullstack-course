const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');

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

  const { name, email, password } = req.body;

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

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    next(new HttpError('Could not create user, please try again.'));
  }

  const newUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: []
  });

  try {
    await newUser.save();
  } catch (error) {
    return next(
      new HttpError('Unalbe to signup, please check try again.', 500)
    );
  }

  let token;
  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );
  } catch (error) {
    return next(new HttpError('Signup failed, please try again.', 500));
  }

  res
    .status(201)
    .json({ uerId: newUser.id, email: newUser.email, token: token });
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

  if (!existingUser) {
    return next(new HttpError('Invalid credentials, please try again.', 403));
  }

  letIsValidPassword = false;
  try {
    letIsValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(
      new HttpError(
        'Could not log you in, please check your credentials and try again.',
        500
      )
    );
  }

  if (!letIsValidPassword) {
    return next(new HttpError('Invalid credentials, please try again.', 500));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );
  } catch (error) {
    return next(new HttpError('Login failed, please try again.', 500));
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token
  });
};

module.exports = {
  getUsers,
  signup,
  login
};
