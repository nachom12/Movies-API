const fs = require('fs');
const TOKEN_MAX_VALUE = 90000;
const TOKEN_MIN_VALUE = 1;

class TokensService {
  constructor() { }

  createToken() {
    return Math.floor(Math.random() * (TOKEN_MAX_VALUE - 1)) + TOKEN_MIN_VALUE;
  }

  updateToken() {
    let tokenTxt = fs.readFileSync('token.txt');
    let tokenObj = JSON.parse(tokenTxt);
    tokenObj.token = this.createToken();
    fs.truncateSync('token.txt');
    fs.writeFileSync('token.txt', JSON.stringify(tokenObj));
  }

  updateUser({ user }) {
    let tokenTxt = fs.readFileSync('token.txt');
    let tokenObj = JSON.parse(tokenTxt);
    tokenObj.currentUser = user.username;
    fs.truncateSync('token.txt');
    fs.writeFileSync('token.txt', JSON.stringify(tokenObj));
  }

  retrieveToken() {
    try {
      const tokenData = fs.readFileSync('token.txt');
      let tokenDataObject = JSON.parse(tokenData);
      const stringToken = tokenDataObject.token.toString();
      // tokenDataObject.currentUser = user.username;
      return stringToken;
    } catch (err) {
      throw err;
    }
  }

  async checkToken(token) {
    try {
      if (token == this.retrieveToken()) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      throw err;
    }
  }

}

module.exports = TokensService;