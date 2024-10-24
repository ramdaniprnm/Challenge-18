import Table from "cli-table";
import { db } from "../models/database/db.js";
import { jurusanModel } from "../models/jurusanModel.js";
import { jurusanView } from "../views/jurusanView.js";
import { mainMenuController } from "./mainMenuController.js";

export const jurusanController = {
  menuJurusan: (rl) => {
    jurusanView.optionMenuJurusan();
    rl.question(
      jurusanView.question(),
      "Masukkan salah satu nomor opsi: ",
      (option) => {
        switch (option.trim()) {
          case "1":
            jurusanController.listJurusan(rl);
            break;
          case "2":
            jurusanController.searchJurusan(rl);
            break;
          case "3":
            jurusanController.addJurusan(rl);
            break;
          case "4":
            jurusanController.deleteJurusan(rl);
            break;
          case "5":
            mainMenuController.menu(rl);
            break;
          default:
            jurusanView.invalidOption();
            jurusanController.menuJurusan(rl);
        }
      }
    );
  },
  listJurusan: (rl) => {
    jurusanModel.listJurusan((err, rows) => {
      if (err) {
        console.error("Error fetching jurusan: ", err.message);
        return jurusanController.menuJurusan(rl);
      }
      jurusanView.rowJurusan(rows);
      return jurusanController.menuJurusan(rl);
    });
  },
  searchJurusan: (rl) => {
    rl.question("Masukkan Kode Jurusan: ", (id_jurusan) => {
      jurusanModel.searchJurusan(id_jurusan, (err, row) => {
        if (err) {
          console.log("Error: ", err.message);
          return jurusanController.menuJurusan(rl);
        }
        if (row) {
          console.log(`Detail jurusan dengan Kode '${id_jurusan}'`);
          jurusanView.jurusanDetail(row);
        } else {
          jurusanView.jurusanNotFound(id_jurusan);
        }
        return jurusanController.menuJurusan(rl);
      });
    });
  },
  addJurusan: (rl) => {
    const queryGetAllJurusan = `
      SELECT * FROM jurusan
    `;
    db.all(queryGetAllJurusan, [], (err, rows) => {
      if (err) {
        console.error("Error saat mengambil data jurusan: ", err.message);
        return jurusanController.menuJurusan(rl);
      }
      const tableJurusan = new Table({
        head: ["Kode Jurusan", "Nama Jurusan"],
        colWidths: [20, 30],
      });
      rows.forEach((row) => {
        tableJurusan.push([row.id_jurusan, row.nama_jurusan]);
      });
      console.log(tableJurusan.toString());
      console.log("Lengkapi data di bawah ini untuk menambahkan jurusan baru.");

      rl.question("Kode Jurusan: ", (id_jurusan) => {
        const queryCheckJurusan =
          "SELECT id_jurusan FROM jurusan WHERE id_jurusan = ?";
        db.get(queryCheckJurusan, [id_jurusan], (err, row) => {
          if (err) {
            console.error("Error saat memeriksa Kode Jurusan: ", err.message);
            return jurusanController.menuJurusan(rl);
          }
          if (row) {
            console.log(
              `Jurusan dengan Kode Jurusan '${id_jurusan}' sudah ada. Silahkan coba lagi.`
            );
            return jurusanController.menuJurusan(rl);
          }

          rl.question("Nama Jurusan: ", (nama_jurusan) => {
            const queryAddJurusan = `
              INSERT INTO jurusan (id_jurusan, nama_jurusan)
              VALUES (?, ?)
            `;
            db.run(queryAddJurusan, [id_jurusan, nama_jurusan], (err) => {
              if (err) {
                console.error("Error saat menambahkan jurusan: ", err.message);
                return jurusanController.menuJurusan(rl);
              }
              console.log(
                `\nJurusan dengan Kode Jurusan '${id_jurusan}' telah ditambahkan.`
              );
              return jurusanController.menuJurusan(rl);
            });
          });
        });
      });
    });
  },
  deleteJurusan: (rl) => {
    rl.question("Masukkan NIM jurusan yang akan dihapus: ", (id_jurusan) => {
      const queryCheckid_jurusan =
        "SELECT id_jurusan FROM jurusan WHERE id_jurusan = ?";
      db.get(queryCheckid_jurusan, [id_jurusan], (err, row) => {
        if (err) {
          console.error("Error saat memeriksa id_jurusan: ", err.message);
          return jurusanController.menuJurusan(rl);
        }
        if (!row) {
          console.log(
            `jurusan dengan Kode Jurusan '${id_jurusan}' tidak ditemukan.`
          );
          return jurusanController.menuJurusan(rl);
        }

        const queryDeletejurusan = "DELETE FROM jurusan WHERE id_jurusan = ?";
        db.run(queryDeletejurusan, [id_jurusan], (err) => {
          if (err) {
            console.error("Error saat menghapus jurusan: ", err.message);
            return jurusanController.menuJurusan(rl);
          }
          console.log(
            `Data jurusan dengan Kode Jurusan '${id_jurusan}' telah dihapus.`
          );
          return jurusanController.menuJurusan(rl);
        });
      });
    });
  },
};
