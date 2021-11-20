const { response } = require('express');
const express = require('express');
const UsersService = require('../services/users.js');

function users(app) {
  const router = express.Router();
  app.use('/api/users', router);

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
      const data = await usersService.newUser({ user });
      res.status(200).json({
        res: data
      });
    } catch (err) {
      res.status(400).json({
        error: `${err.message}`
      });
    }
  });

  router.post('/login', async function (req, res, next) {
    const { user } = req.body      
    try {
      const {registeredUser, token} = await usersService.authenticateUser({ user });
      res.set('Authorization', token);
      res.status(200).json({
        message: `${registeredUser.name} is authenticated`
      });
    } catch (err) {
      next(err);
      res.status(400).json({
        error: `${err.message}`
      });
    }
  });
}


module.exports = { users };