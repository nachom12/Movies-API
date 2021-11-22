const axios = require('axios');
const url = require('url');
const TokensService = require('../services/tokens.js');

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;
const hi = process.env.GREET;

class MoviesService {
  constructor() { }

  async getMovie(id) {
    try {
      const response = await axios.get(`${API_URL}/movie/${id}?api_key=${API_KEY}`);
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  getMoviesByKeyword(keyword) { }

}

module.exports = MoviesService;