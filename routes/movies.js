const express = require('express');
const MoviesService = require('../services/movies.js');
const TokensService = require('../services/tokens.js');
const UsersService = require('../services/users.js');

function movies(app) {
  const router = express.Router();
  app.use('/api/movies', router);

  const moviesService = new MoviesService();
  const tokensService = new TokensService();
  const usersService = new UsersService();

  // router.get('/:id', async function (req, res, next) {
  //   const { id } = req.params;
  //   try {
  //     const movies = await moviesService.getMovie(id);
  //     res.status(200).json({
  //       movies
  //     });
  //   } catch (err) {
  //     next(err);
  //     res.status(400).json({
  //       error: `${err.message}`
  //     });
  //   }
  // });

  router.get('/', async function (req, res, next) {
    const { keyword } = req.query;
    try {
      const movies = await moviesService.getMoviesByKeyword(keyword);
      res.status(200).json({
        movies
      });
    } catch (err) {
      next(err);
      res.status(400).json({
        error: `${err.message}`
      });
    }
  });

  router.post('/:movieId/favourites', async function (req, res, next) {
    const { movieId } = req.params;
    const { authorization } = req.headers;
    try {
      await tokensService.checkToken(authorization);
      const data = await usersService.addFavouriteMovie(movieId);
      res.status(200).json({
        data
      });
    } catch (err) {
      next(err);
      res.status(400).json({
        error: `${err.message}`
      });
    }
  });

  router.get('/favourites', async function (req, res, next) {
    try {
      const data = await usersService.getUsersFavourites();
      res.status(200).json({
        data
      });
    } catch (err) {
      next(err);
    }
  });
}

module.exports = { movies };