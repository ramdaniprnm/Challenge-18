export const mainMenuController = {
  menu: (rl) => {
    mainMenuView.optionMainMenu();
    rl.question(mainMenuView.pertanyaan(), (option) => {
      switch (option) {
      }
    });
  },
};
