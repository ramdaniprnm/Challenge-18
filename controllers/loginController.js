import { userModel } from "../models/userModel.js";
import loginView from "../views/loginView.js";
import { mainMenuController } from "./mainMenuController.js";

export const loginController = {
  login: (rl) => {
    loginView.askUsername(rl, (username) => {
      userModel.login(username, (user) => {
        if (!user) {
          loginView.loginFailed("Username Not Found 404");
          return loginController.login(rl);
        }
        loginView.askPassword(rl, (password) => {
          if (password === user.password) {
            loginView.loginSucceed(user);
            return mainMenuController.mainMenu(rl);
          } else {
            loginView.loginFailed("Password Incorrect");
            return loginController.login(rl);
          }
        });
      });
    });
  },
};
