import { db } from "../models/database/db.js";
import { mainMenuView } from "../views/mainMenuView.js";
import { dosenController } from "./dosenController.js";
import { jurusanController } from "./jurusanController.js";
import { KontrakController } from "./kontrakController.js";
import { mahasiswaController } from "./mahasiswaController.js";
import { matakuliahController } from "./matakuliahController.js";

export const mainMenuController = {
  menu: (rl) => {
    mainMenuView.optionMainMenu(rl);
    rl.question(mainMenuView.question(), (option) => {
      switch (option.trim()) {
        case "1":
          mahasiswaController.menuMahasiswa(rl);
          break;
        case "2":
          jurusanController.menuJurusan(rl);
          break;
        case "3":
          dosenController.menuDosen(rl);
          break;
        case "4":
          matakuliahController.menuMatakuliah(rl);
          break;
        case "5":
          KontrakController.menuKontrak(rl);
          break;
        case "6":
          mainMenuView.exit(rl);
          db.close();
          rl.close();
          process.exit();
        default:
          console.log("Invalid Option. please choose a correct number.");
          return mainMenuController.menu(rl);
      }
    });
  },
};
