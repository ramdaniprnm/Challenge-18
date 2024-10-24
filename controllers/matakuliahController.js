import Table from "cli-table";
import { db } from "../models/database/db.js";
import { matakuliahView } from "../views/matakuliahView.js";
import { mainMenuController } from "./mainMenuController.js";
import { matakuliahModel } from "../models/matakuliahModel.js";

export const matakuliahController = {
  menuMatakuliah: (rl) => {
    matakuliahView.optionMenuMatakuliah();
    rl.question(
      matakuliahView.question(),
      "Masukkan salah satu nomor opsi: ",
      (option) => {
        switch (option.trim()) {
          case "1":
            matakuliahController.listMatakuliah(rl);
            break;
          case "2":
            matakuliahController.searchMatakuliah(rl);
            break;
          case "3":
            matakuliahController.addMatakuliah(rl);
            break;
          case "4":
            matakuliahController.deleteMatakuliah(rl);
            break;
          case "5":
            mainMenuController.menu(rl);
            break;
          default:
            matakuliahView.invalidOption();
            matakuliahController.menuMatakuliah(rl);
        }
      }
    );
  },
  listMatakuliah: (rl) => {
    matakuliahModel.listMatakuliah((err, rows) => {
      if (err) {
        console.error("Error fetching Matakuliah: ", err.message);
        return matakuliahController.menuMatakuliah(rl);
      }
      matakuliahView.rowMatakuliah(rows);
      return matakuliahController.menuMatakuliah(rl);
    });
  },
  searchMatakuliah: (rl) => {
    rl.question("Masukkan Kode Matakuliah: ", (id_matakuliah) => {
      matakuliahModel.searchMatakuliah(id_matakuliah, (err, row) => {
        if (err) {
          console.log("Error: ", err.message);
          return matakuliahController.menuMatakuliah(rl);
        }
        if (row) {
          console.log(`Detail Matakuliah dengan Kode '${id_matakuliah}'`);
          matakuliahView.MatakuliahDetail(row);
        } else {
          matakuliahView.MatakuliahNotFound(id_matakuliah);
        }
        return matakuliahController.menuMatakuliah(rl);
      });
    });
  },
  addMatakuliah: (rl) => {
    const queryGetAllMatakuliah = `
      SELECT * FROM matakuliah
    `;
    db.all(queryGetAllMatakuliah, [], (err, rows) => {
      if (err) {
        console.error("Error saat mengambil data Matakuliah: ", err.message);
        return matakuliahController.menuMatakuliah(rl);
      }
      const tableMatakuliah = new Table({
        head: ["ID Matakuliah", "Nama Matakuliah", "SKS"],
        colWidths: [20, 30, 10],
      });
      rows.forEach((row) => {
        tableMatakuliah.push([row.id_matakuliah, row.nama, row.sks]);
      });
      console.log(tableMatakuliah.toString());
      console.log(
        "Lengkapi data di bawah ini untuk menambahkan Matakuliah baru."
      );

      rl.question("NIP Matakuliah: ", (id_matakuliah) => {
        const queryCheckMatakuliah =
          "SELECT id_matakuliah FROM matakuliah WHERE id_matakuliah = ?";
        db.get(queryCheckMatakuliah, [id_matakuliah], (err, row) => {
          if (err) {
            console.error(
              "Error saat memeriksa Kode Matakuliah: ",
              err.message
            );
            return matakuliahController.menuMatakuliah(rl);
          }
          if (row) {
            console.log(
              `Matakuliah dengan ID '${id_matakuliah}' sudah ada. Silahkan coba lagi.`
            );
            return matakuliahController.menuMatakuliah(rl);
          }

          rl.question("Nama Matakuliah: ", (nama) => {
            rl.question("SKS: ", (sks) => {
              const queryAddMatakuliah = `
                  INSERT INTO matakuliah (id_matakuliah, nama, sks)
                  VALUES (?, ?, ?)`;
              db.run(queryAddMatakuliah, [id_matakuliah, nama, sks], (err) => {
                if (err) {
                  console.error(
                    "Error saat menambahkan Matakuliah: ",
                    err.message
                  );
                  return matakuliahController.menuMatakuliah(rl);
                }
                console.log(
                  `\nMatakuliah dengan Kode Matakuliah '${id_matakuliah}' telah ditambahkan.`
                );
                return matakuliahController.menuMatakuliah(rl);
              });
            });
          });
        });
      });
    });
  },

  deleteMatakuliah: (rl) => {
    rl.question(
      "Masukkan NIP Matakuliah yang akan dihapus: ",
      (id_Matakuliah) => {
        const queryCheckid_Matakuliah =
          "SELECT id_matakuliah FROM matakuliah WHERE id_matakuliah = ?";
        db.get(queryCheckid_Matakuliah, [id_Matakuliah], (err, row) => {
          if (err) {
            console.error("Error saat memeriksa id_Matakuliah: ", err.message);
            return matakuliahController.menuMatakuliah(rl);
          }
          if (!row) {
            console.log(
              `Matakuliah dengan Kode Matakuliah '${id_Matakuliah}' tidak ditemukan.`
            );
            return matakuliahController.menuMatakuliah(rl);
          }
          const queryDeleteMatakuliah =
            "DELETE FROM matakuliah WHERE id_matakuliah = ?";
          db.run(queryDeleteMatakuliah, [id_Matakuliah], (err) => {
            if (err) {
              console.error("Error saat menghapus Matakuliah: ", err.message);
              return matakuliahController.menuMatakuliah(rl);
            }
            console.log(
              `Data Matakuliah dengan Kode Matakuliah '${id_Matakuliah}' telah dihapus.`
            );
            return matakuliahController.menuMatakuliah(rl);
          });
        });
      }
    );
  },
};
