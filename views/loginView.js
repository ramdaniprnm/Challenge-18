export const loginView = {
  askUsername: (rl, callback) => {
    rl.question("username: ", (username) => {
      callback(username);
    });
  },
  askPassword: (rl, callback) => {
    rl.question("password: ", (password) => {
      callback(password);
    });
  },
  loginSucceed: (user) => {
    console.log(
      `\nLogin successful! Welcome, ${
        user.username
      }. "Your access level is: ", ${user.role.toUpperCase()}`
    );
  },
  loginFailed: (message) => {
    console.log(`Login failed: ${message}`);
  },
};
