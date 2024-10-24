import Table from "cli-table";
import { db } from "../models/database/db.js";
import { DosenView } from "../views/dosenView.js";
import { dosenModel } from "../models/dosenModel.js";
import { mainMenuController } from "./mainMenuController.js";

export const dosenController = {
  menuDosen: (rl) => {
    DosenView.optionMenuDosen();
    rl.question(
      DosenView.question(),
      "Masukkan salah satu nomor opsi: ",
      (option) => {
        switch (option.trim()) {
          case "1":
            dosenController.listDosen(rl);
            break;
          case "2":
            dosenController.searchDosen(rl);
            break;
          case "3":
            dosenController.addDosen(rl);
            break;
          case "4":
            dosenController.deleteDosen(rl);
            break;
          case "5":
            mainMenuController.menu(rl);
            break;
          default:
            DosenView.invalidOption();
            dosenController.menuDosen(rl);
        }
      }
    );
  },
  listDosen: (rl) => {
    dosenModel.listDosen((err, rows) => {
      if (err) {
        console.error("Error fetching dosen: ", err.message);
        return dosenController.menuDosen(rl);
      }
      DosenView.rowDosen(rows);
      return dosenController.menuDosen(rl);
    });
  },
  searchDosen: (rl) => {
    rl.question("Masukkan Kode dosen: ", (nip) => {
      dosenModel.searchDosen(nip, (err, row) => {
        if (err) {
          console.log("Error: ", err.message);
          return dosenController.menuDosen(rl);
        }
        if (row) {
          console.log(`Detail dosen dengan Kode '${nip}'`);
          DosenView.dosenDetail(row);
        } else {
          DosenView.dosenNotFound(nip);
        }
        return dosenController.menuDosen(rl);
      });
    });
  },
  addDosen: (rl) => {
    const queryGetAlldosen = `
        SELECT * FROM dosen
      `;
    db.all(queryGetAlldosen, [], (err, rows) => {
      if (err) {
        console.error("Error saat mengambil data dosen: ", err.message);
        return dosenController.menuDosen(rl);
      }
      const tableDosen = new Table({
        head: ["NIP dosen", "Nama dosen"],
        colWidths: [20, 30],
      });
      rows.forEach((row) => {
        tableDosen.push([row.nip, row.nama]);
      });
      console.log(tableDosen.toString());
      console.log("Lengkapi data di bawah ini untuk menambahkan dosen baru.");

      rl.question("NIP dosen: ", (nip) => {
        const queryCheckDosen = "SELECT nip FROM dosen WHERE nip = ?";
        db.get(queryCheckDosen, [nip], (err, row) => {
          if (err) {
            console.error("Error saat memeriksa Kode dosen: ", err.message);
            return dosenController.menuDosen(rl);
          }
          if (row) {
            console.log(
              `dosen dengan NIP '${nip}' sudah ada. Silahkan coba lagi.`
            );
            return dosenController.menuDosen(rl);
          }

          rl.question("Nama dosen: ", (nama) => {
            const queryAdddosen = `
                INSERT INTO dosen (nip, nama)
                VALUES (?, ?)
              `;
            db.run(queryAdddosen, [nip, nama], (err) => {
              if (err) {
                console.error("Error saat menambahkan dosen: ", err.message);
                return dosenController.menuDosen(rl);
              }
              console.log(
                `\ndosen dengan Kode dosen '${nip}' telah ditambahkan.`
              );
              return dosenController.menuDosen(rl);
            });
          });
        });
      });
    });
  },
  deleteDosen: (rl) => {
    rl.question("Masukkan NIP dosen yang akan dihapus: ", (nip) => {
      const queryCheckid_dosen = "SELECT nip FROM dosen WHERE nip = ?";
      db.get(queryCheckid_dosen, [nip], (err, row) => {
        if (err) {
          console.error("Error saat memeriksa id_dosen: ", err.message);
          return dosenController.menuDosen(rl);
        }
        if (!row) {
          console.log(`dosen dengan Kode dosen '${nip}' tidak ditemukan.`);
          return dosenController.menuDosen(rl);
        }
        const queryDeletedosen = "DELETE FROM dosen WHERE nip = ?";
        db.run(queryDeletedosen, [nip], (err) => {
          if (err) {
            console.error("Error saat menghapus dosen: ", err.message);
            return dosenController.menuDosen(rl);
          }
          console.log(`Data dosen dengan Kode dosen '${nip}' telah dihapus.`);
          return dosenController.menuDosen(rl);
        });
      });
    });
  },
};
