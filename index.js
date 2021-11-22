require('dotenv').config();
const express = require('express');
var app = express();
const port = process.env.PORT;
const { users } = require('../Movies-API/routes/users.js');
const { movies } = require('../Movies-API/routes/movies.js');


app.use(express.json());
users(app);
movies(app);

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
})
