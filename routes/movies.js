const express = require('express');
const MoviesService = require('../services/movies.js');
const TokensService = require('../services/tokens.js');
const UsersService = require('../services/users.js');
const userErrorHandler = require('../middleware/userErrorHandler.js');

function movies(app) {
  const router = express.Router();
  app.use('/api/movies', router);
  app.use(userErrorHandler);

  const moviesService = new MoviesService();
  const tokensService = new TokensService();
  const usersService = new UsersService();

  router.get('/', async function (req, res, next) {
    const { keyword } = req.query;
    const { authorization } = req.headers;
    try {
      const tokenCheck = await tokensService.checkToken(authorization);
      if (tokenCheck) {
        const movies = await moviesService.getMoviesByKeyword(keyword);
        res.status(200).json({
          movies
        });
      } else {
        throw Error('Incorrect authorization token');
      }
    } catch (err) {
      next(err);
    }
  });

  router.post('/:movieId/favourites', async function (req, res, next) {
    const { movieId } = req.params;
    const { authorization } = req.headers;
    try {
      const tokenCheck = await tokensService.checkToken(authorization);
      if (tokenCheck) {
        const data = await usersService.addFavouriteMovie(movieId);
        res.status(200).json({
          data
        });
      } else {
        throw Error('Incorrect authorization token');
      }
    } catch (err) {
      next(err);
    }
  });

  router.get('/favourites', async function (req, res, next) {
    const { authorization } = req.headers;
    try {
      const tokenCheck = await tokensService.checkToken(authorization);
      if (tokenCheck) {
        const data = await usersService.getUsersFavourites();
        res.status(200).json({
          movies: data
        });
      } else {
        throw Error('Incorrect authorization token');
      }
    } catch (err) {
      next(err);
    }
  });
}

module.exports = { movies };