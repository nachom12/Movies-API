const e = require('express');
const fs = require('fs');
const TokensService = require('../services/tokens.js');

class UsersService {
  constructor() {
    this.tokensService = new TokensService();
  }

  async getUsers() {
    try {
      const data = fs.readFileSync('users.txt');
      return JSON.parse(data);
    } catch (err) {
      console.log(err);
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
      // TODO: set null username in token.txt
      this.tokensService.updateToken();
      return true;
    } else {
      return false;
    }
  }

}

module.exports = UsersService;