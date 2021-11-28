const express = require('express');
const UsersService = require('../services/users.js');
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

  router.post('/', async function (req, res, next) {
    const { user } = req.body
    try {
      const signUpResult = await usersService.newUser({ user });
      if (!signUpResult) {
        throw Error('That username has been taken');
      }
      res.status(201).json({
        user
      });
    } catch (err) {
      next(err);
    }
  });

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