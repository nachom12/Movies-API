const e = require('express');
const fs = require('fs');
const TokensService = require('../services/tokens.js');
const MoviesService = require('./movies.js');

class UsersService {
  constructor() {
    this.tokensService = new TokensService();
    this.moviesService = new MoviesService();
  }

  async getUsers() {
    try {
      const data = fs.readFileSync('users.txt');
      return JSON.parse(data);
    } catch (err) {
      return 'error'
    }
  }

  async newUser({ user }) {
    try {
      const { email } = user;
      const users = await this.getUsers();
      const emailTaken = (users.filter(user => user.email == email).length != 0);
      if (!emailTaken) {
        users.push(user);
        const usersText = JSON.stringify(users);
        fs.truncateSync('users.txt');
        fs.writeFileSync('users.txt', usersText);
        return true;
      } else {
        return false;
      }

    } catch (err) {
      throw err;
    }
  }

  async authenticateUser({ user }) {
    try {
      const registeredUsers = await this.getUsers();
      const registeredUser = registeredUsers.find(registeredUser => {
        return registeredUser.email === user.email
      });
      if (registeredUser != null) {
        if (user.password === registeredUser.password) {
          const token = this.tokensService.retrieveToken({ user });
          this.tokensService.updateUser({ user })
          return { token };
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (err) {
      throw err;
    }
  }

  async logoutUser(token, user) {
    const tokenCheck = await this.tokensService.checkToken(token);
    if (tokenCheck) {
      this.tokensService.updateToken();
      return true;
    } else {
      return false;
    }
  }

  async getCurrentUser() {
    const data = fs.readFileSync('token.txt');
    const { currentUser } = JSON.parse(data);
    return currentUser;
  }

  async addFavouriteMovie(movieId) {
    try {
      const email = await this.getCurrentUser();
      const movie = await this.moviesService.getMovie(movieId);
      let favouriteData = { email, movie };
      const result = this.saveFavouriteMovie(favouriteData)
      return result;
    } catch (err) {
      throw err;
    }
  }

  async saveFavouriteMovie(data) {
    try {
      const favouritesTXT = fs.readFileSync('favourites.txt');
      const favourites = JSON.parse(favouritesTXT);
      if (!this.isMovieAlreadyAFavourite(data.movie, data.email)) {
        favourites.push(data);
        const newFavouritesTXT = JSON.stringify(favourites);
        fs.truncateSync('favourites.txt');
        fs.writeFileSync('favourites.txt', newFavouritesTXT);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      throw err;
    }
  }


  isMovieAlreadyAFavourite(movie, email) {
    const favouritesTXT = fs.readFileSync('favourites.txt');
    const favourites = JSON.parse(favouritesTXT);
    const userFavourites = favourites.filter(favouriteData => (favouriteData.email == email && favouriteData.movie.id == movie.id))
    if (!userFavourites.length) {
      return false;
    } else {
      return true;
    }
  }

  async getUsersFavourites() {
    const email = await this.getCurrentUser();
    const favouritesTXT = fs.readFileSync('favourites.txt');
    const userFavourites = JSON.parse(favouritesTXT).filter(favouriteData => favouriteData.email == email);
    const userFavouriteMovies = userFavourites.map(favourite => {
      favourite.movie.suggestionForTodayScore = this.moviesService.calculateSuggestionScore();
      const { movie , ...rest } = favourite;
      return movie;
    });
    return userFavouriteMovies.sort((a, b) => b.suggestionForTodayScore - a.suggestionForTodayScore);
  }

}

module.exports = UsersService;