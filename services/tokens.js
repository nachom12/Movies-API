const fs = require('fs');

class TokensService {
  constructor() {}

  createToken() {
    return Math.floor(Math.random() * (90000 - 1)) + min;
  }

  updateToken(){
    const newToken = this.createToken();
    fs.truncateSync('tokens.txt');
    fs.writeFile('tokens.txt', newToken, function (err) {
      if (err) throw Error('Error writing tokens.txt');
    });
  }

  retrieveToken(){
    try{
      const token = fs.readFileSync('token.txt');
      const stringToken = token.toString();
      return stringToken;
    } catch(err) {
      throw err;
    }
  }

}

module.exports = TokensService;