const axios = require('axios');
const { response } = require('express');
const url = require('url');
const TokensService = require('../services/tokens.js');

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;


class MoviesService {
  constructor() { }

  calculateSuggestionScore() {
    return Math.floor(Math.random() * (99 - 1));
  }

  async getMovie(movieId) {
    try {
      const { data } = await axios.get(`${API_URL}/movie/${movieId}?api_key=${API_KEY}`);
      const { original_title, genres, id, popularity } = data;
      return {original_title, genres,id, popularity};
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
      let movies = []
      const { data: { results } } = await axios.get(`${API_URL}/search/keyword?api_key=${API_KEY}&query=${keyword}`);
      let moviesByKeyword = await Promise.all(results.map(async (keyword) => {
        const moviesOfKeyword = await this.getMoviesOfKeyword(keyword.id);
        return { keyword, moviesOfKeyword }
      }));
      moviesByKeyword.map(data => {
        data.moviesOfKeyword.map(movie => {
          movies.push(movie);
        });
      });
      return movies.sort((a, b) => b.suggestionScore - a.suggestionScore)
    } catch (err) {
      throw err;
    }
  }
}

module.exports = MoviesService;