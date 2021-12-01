const express = require('express');
const UsersService = require('../services/users.js');
const { body, validationResult } = require('express-validator');
const userErrorHandler = require('../middleware/userErrorHandler.js');

function users(app) {
  const router = express.Router();
  app.use('/api/users', router);
  app.use(userErrorHandler);

  const usersService = new UsersService();

  router.get('/', async function (req, res) {
    const data = await usersService.getUsers();
    res.status(200).json({
      users: data
    });
  });

  router.post('/', 
    body('user.email').isEmail(),
    body('user.password').isLength({ min: 5 }), 
    async function (req, res, next) {
      const errors = validationResult(req);
      const { user } = req.body
      try {
        if (!errors.isEmpty()){
          return next(errors);
        }
        const signUpResult = await usersService.newUser({ user });
        if (!signUpResult) {
          throw Error('That email has been taken');
        }
        res.status(201).json({
          message: 'User created'
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.post('/login', async function (req, res, next) {
    const { user } = req.body
    try {
      const { token } = await usersService.authenticateUser({ user });
      if (token == null) {
        throw Error('Incorrect login');
      } else {
        res.set('Authorization', token);
        res.status(200).json({
          message: `user authenticated`
        });
      }
    } catch (err) {
      next(err);
    }
  });

  router.post('/logout', async function (req, res, next) {
    const { authorization } = req.headers
    try {
      const logoutResult = await usersService.logoutUser(authorization);
      if (logoutResult) {
        res.status(200).json({
          message: `Log out success`
        });
      } else {
        throw Error('Incorrect authorization token');
      }
    } catch (err) {
      next(err);
    }
  });
}


module.exports = { users };