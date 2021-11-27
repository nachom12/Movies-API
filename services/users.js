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
      const { name, username, password } = user;
      const users = await this.getUsers();
      users.forEach(user => {
        if (user.username === username) {
          throw Error('That UserName has been taken');
        }
      });
      users.push(user);
      const usersText = JSON.stringify(users);
      fs.truncateSync('users.txt');
      fs.writeFile('users.txt', usersText, function (err) {
        if (err) throw Error('Error writing users.txt');
      });
    } catch (err) {
      throw err;
    }
  }

  async authenticateUser({ user }) {
    try {
      const registeredUsers = await this.getUsers();
      const registeredUser = registeredUsers.find(registeredUser => {
        return registeredUser.username === user.username
      });
      if (registeredUser != null) {
        if (user.password === registeredUser.password) {
          const token = this.tokensService.retrieveToken({ user });
          this.tokensService.updateUser({ user })
          return { registeredUser, token };
        } else {
          throw Error('Incorrect password');
        }
      } else {
        throw Error('User not registered')
      }
    } catch (err) {
      throw err;
    }
  }

  async logoutUser(token, user) {
    if (this.tokensService.checkToken(token)) {
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
      const username = await this.getCurrentUser();
      const movie = await this.moviesService.getMovie(movieId);
      let favouriteData = { username, movie };
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
      if (!this.isMovieAlreadyAFavourite(data.movie, data.username)) {
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
  
  
  isMovieAlreadyAFavourite(movie, username) {
    const favouritesTXT = fs.readFileSync('favourites.txt');
    const favourites = JSON.parse(favouritesTXT);
    const userFavourites = favourites.filter(favouriteData => (favouriteData.username == username && favouriteData.movie.id == movie.id))
    if (!userFavourites.length) {
      return false;
    } else {
      return true;
    }
  }
  
  async getUsersFavourites() {
    const username = await this.getCurrentUser();
    const favouritesTXT = fs.readFileSync('favourites.txt');
    const userFavourites = JSON.parse(favouritesTXT).filter(favouriteData => favouriteData.username == username);
    const userFavouriteMovies = userFavourites.map( favourite => {
      favourite.suggestionForTodayScore = this.moviesService.calculateSuggestionScore();
      const {movie , ...rest} = favourite;
      return movie;
    }); 
    return userFavouriteMovies.sort((a,b) => b.suggestionForTodayScore - a.suggestionForTodayScore);
  }

}

module.exports = UsersService;