const fs = require('fs');
const TOKEN_MAX_VALUE = 90000;
const TOKEN_MIN_VALUE = 1;

class TokensService {
  constructor() { }

  createToken() {
    return Math.floor(Math.random() * (TOKEN_MAX_VALUE - 1)) + TOKEN_MIN_VALUE;
  }

  updateToken() {
    const newToken = this.createToken();
    fs.truncateSync('token.txt');
    fs.writeFile('token.txt', newToken, function (err) {
      if (err) throw Error('Error writing token.txt');
    });
  }

  retrieveToken() {
    try {
      const token = fs.readFileSync('token.txt');
      const stringToken = token.toString();
      return stringToken;
    } catch (err) {
      throw err;
    }
  }

  checkToken(token) {
    try {
      if (token == this.retrieveToken()) {
        this.updateToken();
        return true;
      } else {
        throw Error('Incorrect authorization token');
      }
    } catch (err) {
      throw err;
    }
  }

}

module.exports = TokensService;