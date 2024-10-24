import Table from "cli-table";
import { db } from "../models/database/db.js";
import { mahasiswaView } from "../views/mahasiswaView.js";
import { mahasiswaModel } from "../models/mahasiswaModel.js";
import { mainMenuController } from "./mainMenuController.js";

export const mahasiswaController = {
  menuMahasiswa: (rl) => {
    mahasiswaView.optionMenuMahasiswa();
    rl.question(
      mahasiswaView.question(),
      "Masukkan salah satu nomor opsi: ",
      (option) => {
        switch (option.trim()) {
          case "1":
            mahasiswaController.listMahasiswa(rl);
            break;
          case "2":
            mahasiswaController.searchMahasiswa(rl);
            break;
          case "3":
            mahasiswaController.addMahasiswa(rl);
            break;
          case "4":
            mahasiswaController.deleteMahasiswa(rl);
            break;
          case "5":
            mainMenuController.menu(rl);
            break;
          default:
            mahasiswaView.invalidOption();
            mahasiswaController.menuMahasiswa(rl);
        }
      }
    );
  },
  listMahasiswa: (rl) => {
    mahasiswaModel.listStudent((err, rows) => {
      if (err) {
        console.error("Error fetching mahasiswa: ", err.message);
        return mahasiswaController.menuMahasiswa(rl);
      }
      mahasiswaView.rowMahasiswa(rows);
      return mahasiswaController.menuMahasiswa(rl);
    });
  },
  searchMahasiswa: (rl) => {
    rl.question("Masukkan NIM: ", (nim) => {
      mahasiswaModel.searchStudent(nim, (err, row) => {
        if (err) {
          console.log("Error: ", err.message);
          return mahasiswaController.menuMahasiswa(rl);
        }
        if (row) {
          console.log(`Detail mahasiswa dengan NIM '${nim}'`);
          mahasiswaView.mahasiswaDetail(row);
        } else {
          mahasiswaView.mahasiswaNotFound(nim);
        }
        return mahasiswaController.menuMahasiswa(rl);
      });
    });
  },
  addMahasiswa: (rl) => {
    const queryGetAllMahasiswa = `
      SELECT m.nim, m.nama, m.tgl_lahir, m.alamat, m.id_jurusan, j.nama_jurusan
      FROM mahasiswa m
      JOIN jurusan j ON m.id_jurusan = j.id_jurusan
    `;
    db.all(queryGetAllMahasiswa, [], (err, mahasiswaRows) => {
      if (err) {
        console.error("Error saat mengambil data mahasiswa: ", err.message);
        return mahasiswaController.menuMahasiswa(rl);
      }

      const tableMahasiswa = new Table({
        head: [
          "NIM",
          "Nama",
          "Tanggal Lahir",
          "Alamat",
          "Kode Jurusan",
          "Nama Jurusan",
        ],
        colWidths: [10, 25, 15, 30, 15, 30],
      });
      mahasiswaRows.forEach((row) => {
        tableMahasiswa.push([
          row.nim,
          row.nama,
          row.tgl_lahir,
          row.alamat,
          row.id_jurusan,
          row.nama_jurusan,
        ]);
      });
      console.log(tableMahasiswa.toString());
      console.log(
        "Lengkapi data di bawah ini untuk menambahkan mahasiswa baru."
      );

      rl.question("NIM: ", (nim) => {
        const queryCheckNIM = "SELECT nim FROM mahasiswa WHERE nim = ?";

        db.get(queryCheckNIM, [nim], (err, row) => {
          if (err) {
            console.error("Error saat memeriksa NIM: ", err.message);
            return mahasiswaController.menuMahasiswa(rl);
          }
          if (row) {
            console.log(
              `Mahasiswa dengan NIM '${nim}' sudah ada. Silahkan coba lagi.`
            );
            return mahasiswaController.menuMahasiswa(rl);
          }

          rl.question("Nama: ", (nama) => {
            rl.question("Tanggal Lahir: ", (tgl_lahir) => {
              rl.question("Alamat: ", (alamat) => {
                const queryJurusan = "SELECT * FROM jurusan";
                db.all(queryJurusan, [], (err, jurusanRows) => {
                  if (err) {
                    console.error(
                      "Error saat mengambil data jurusan: ",
                      err.message
                    );
                    return mahasiswaController.menuMahasiswa(rl);
                  }

                  const jurusanTable = new Table({
                    head: ["Kode Jurusan", "Nama Jurusan"],
                    colWidths: [15, 30],
                  });
                  jurusanRows.forEach((row) => {
                    jurusanTable.push([row.id_jurusan, row.nama_jurusan]);
                  });
                  console.log(jurusanTable.toString());

                  rl.question("Kode Jurusan: ", (id_jurusan) => {
                    const queryAddMahasiswa = `
                      INSERT INTO mahasiswa (nim, nama, tgl_lahir, alamat, id_jurusan)
                      VALUES (?, ?, ?, ?, ?)
                    `;
                    db.run(
                      queryAddMahasiswa,
                      [nim, nama, tgl_lahir, alamat, id_jurusan],
                      (err) => {
                        if (err) {
                          console.error(
                            "Error saat menambahkan mahasiswa: ",
                            err.message
                          );
                          return mahasiswaController.menuMahasiswa(rl);
                        }
                        console.log(
                          `\nMahasiswa dengan NIM '${nim}' telah ditambahkan.`
                        );
                        return mahasiswaController.menuMahasiswa(rl);
                      }
                    );
                  });
                });
              });
            });
          });
        });
      });
    });
  },
  deleteMahasiswa: (rl) => {
    rl.question("Masukkan NIM Mahasiswa yang akan dihapus: ", (nim) => {
      const queryCheckNIM = "SELECT nim FROM mahasiswa WHERE nim = ?";
      db.get(queryCheckNIM, [nim], (err, row) => {
        if (err) {
          console.error("Error saat memeriksa NIM: ", err.message);
          return mahasiswaController.menuMahasiswa(rl);
        }
        if (!row) {
          console.log(`Mahasiswa dengan NIM '${nim}' tidak ditemukan.`);
          return mahasiswaController.menuMahasiswa(rl);
        }

        const queryDeleteMahasiswa = "DELETE FROM mahasiswa WHERE nim = ?";
        db.run(queryDeleteMahasiswa, [nim], (err) => {
          if (err) {
            console.error("Error saat menghapus mahasiswa: ", err.message);
            return mahasiswaController.menuMahasiswa(rl);
          }
          console.log(`Data Mahasiswa dengan NIM '${nim}' telah dihapus.`);
          return mahasiswaController.menuMahasiswa(rl);
        });
      });
    });
  },
};
