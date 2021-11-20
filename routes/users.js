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

  router.post('/', async function (req, res) {
    const { user } = req.body
    const data = await usersService.newUser({user});
    res.status(200).json({
      res: data
    });
  });

}


module.exports = { users };