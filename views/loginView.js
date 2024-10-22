const loginView = {
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
};

export default loginView; // Use export default for a single export
