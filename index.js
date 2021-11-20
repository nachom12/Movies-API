const express = require('express');
var app = express();
const { users } = require('../Movies-API/routes/users.js')

app.use(express.json());
users(app);

app.listen(3000 , function () {
  console.log('Listening on port 3000');
})
