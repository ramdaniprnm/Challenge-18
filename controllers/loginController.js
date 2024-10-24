import { userModel } from "../models/userModel.js";
import { loginView } from "../views/loginView.js";
import { mainMenuController } from "./mainMenuController.js";

export const loginController = {
  login: (rl) => {
    loginView.askUsername(rl, (username) => {
      userModel.login(username, (user) => {
        if (!user) {
          loginView.loginFailed("Username Not Found 404");
          return loginController.login(rl);
        }
        let attempts = 0;
        const maxAttempts = 5;
        const checkPassword = () => {
          loginView.askPassword(rl, (password) => {
            if (password === user.password) {
              loginView.loginSucceed(user);
              return mainMenuController.menu(rl);
            } else {
              attempts += 1;
              if (attempts >= maxAttempts) {
                console.log("Anda telah gagal login. Anda keluar.");
                rl.close();
              } else {
                console.log(`Password salah`);
                checkPassword();
              }
            }
          });
        };
        checkPassword();
      });
    });
  },
};
