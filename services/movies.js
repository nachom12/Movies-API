const axios = require('axios');
const url = require('url');
const TokensService = require('../services/tokens.js');

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;


class MoviesService {
  constructor() { }

  calculateSuggestionScore() {
    return Math.floor(Math.random() * (99 - 1));
  }

  async getMovie(id) {
    try {
      const response = await axios.get(`${API_URL}/movie/${id}?api_key=${API_KEY}`);
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  async getMoviesOfKeyword(keywordId) {
    try {
      const response = await axios.get(`${API_URL}/keyword/${keywordId}/movies?api_key=${API_KEY}`);
      return response.data.results.map(movie =>
        ({ original_title: movie.original_title, id: movie.id, suggestionScore: this.calculateSuggestionScore() })
      );
    } catch (err) {
      throw err;
    }
  }

  async getMoviesByKeyword(keyword) {
    try {
      const { data: { results } } = await axios.get(`${API_URL}/search/keyword?api_key=${API_KEY}&query=${keyword}`);
      let movies = await Promise.all(results.map(async (keyword) => {
        const moviesOfKeyword = await this.getMoviesOfKeyword(keyword.id);
        return { keyword, moviesOfKeyword }
      }));
      return movies;
    } catch (err) {
      throw err;
    }
  }

}

module.exports = MoviesService;