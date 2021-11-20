const e = require('express');
const fs = require('fs')

var BreakException = {}

class UsersService {
  constructor() { }

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
      const {name, username, password} = user;
      const users = await this.getUsers();
      console.log(users);
      users.forEach(user => {
        if (user.username === username) {
          throw Error('That UserName has been taken');
        }
      });
      users.push(user);
      console.log(users);
      const usersText = JSON.stringify(users);
      fs.truncateSync('users.txt');
      fs.writeFile('users.txt', usersText, function (err){
        if (err) throw Error('Error writing users.txt')
      }); 
    } catch (err) {
      console.log(err)        
    }
  }
}

module.exports = UsersService