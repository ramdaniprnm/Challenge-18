import Table from "cli-table";
import { db } from "../models/database/db.js";
import { KontrakView } from "../views/kontrakView.js";
import { mainMenuController } from "./mainMenuController.js";
import { KontrakModel } from "../models/kontrakModel.js";

export const KontrakController = {
  menuKontrak: (rl) => {
    KontrakView.optionMenukontrak();
    rl.question(KontrakView.question(), (option) => {
      switch (option.trim()) {
        case "1":
          KontrakController.listKontrak(rl);
          break;
        case "2":
          KontrakController.searchKontrak(rl);
          break;
        case "3":
          KontrakController.addKontrak(rl);
          break;
        case "4":
          KontrakController.deleteKontrak(rl);
          break;
        case "5":
          KontrakController.updateNilaiKontrak(rl);
          break;
        case "6":
          mainMenuController.menu(rl);
          break;
        default:
          KontrakView.invalidInput();
          KontrakController.menuKontrak(rl);
      }
    });
  },

  listKontrak: (rl) => {
    KontrakModel.listKontrak((err, rows) => {
      if (err) {
        console.error("Error fetching kontrak: ", err.message);
        KontrakController.menuKontrak(rl);
        return;
      }
      KontrakView.rowKontrak(rows);
      KontrakController.menuKontrak(rl);
    });
  },

  searchKontrak: (rl) => {
    rl.question("Masukkan NIM Mahasiswa: ", (nim) => {
      KontrakModel.searchKontrak(nim, (err, rows) => {
        if (err) {
          console.log("Error: ", err.message);
          return KontrakController.menuKontrak(rl);
        }
        if (rows.length > 0) {
          console.log(`Detail kontrak mahasiswa dengan NIM '${nim}'`);
          KontrakView.listSearchKontrak(rows);
        } else {
          KontrakView.kontrakNotFound(nim);
        }
        return KontrakController.menuKontrak(rl);
      });
    });
  },
  addKontrak: (rl) => {
    const queryGetAllMahasiswa = `
      SELECT mahasiswa.nim, mahasiswa.nama, mahasiswa.tgl_lahir, mahasiswa.alamat, 
             jurusan.id_jurusan, jurusan.nama_jurusan
      FROM mahasiswa
      LEFT JOIN jurusan ON mahasiswa.id_jurusan = jurusan.id_jurusan
    `;

    db.all(queryGetAllMahasiswa, [], (err, rows) => {
      if (err) {
        console.error("Error fetching mahasiswa data: ", err.message);
        return KontrakController.menuKontrak(rl); // Kembali ke menu jika terjadi error
      }

      // Membuat tabel untuk menampilkan daftar mahasiswa
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

      // Mengisi tabel dengan data mahasiswa
      rows.forEach((row) => {
        tableMahasiswa.push([
          row.nim,
          row.nama,
          row.tgl_lahir,
          row.alamat,
          row.id_jurusan,
          row.nama_jurusan,
        ]);
      });

      console.log("\nDaftar Mahasiswa:");
      console.log(tableMahasiswa.toString());

      // Meminta input NIM dari pengguna
      rl.question("Masukkan NIM Mahasiswa: ", (nim) => {
        // Menampilkan daftar mata kuliah
        const queryGetAllMatkul = `SELECT id_matakuliah, nama, sks FROM matakuliah`;

        db.all(queryGetAllMatkul, [], (err, matkulRows) => {
          if (err) {
            console.error("Error fetching matakuliah data: ", err.message);
            return KontrakController.menuKontrak(rl); // Kembali ke menu jika terjadi error
          }

          const tableMatkul = new Table({
            head: ["Kode Matkul", "Nama Matkul", "SKS"],
            colWidths: [15, 30, 5],
          });

          matkulRows.forEach((row) => {
            tableMatkul.push([row.id_matakuliah, row.nama, row.sks]);
          });

          console.log("\nDaftar Mata Kuliah:");
          console.log(tableMatkul.toString());

          rl.question("Masukkan Kode Mata Kuliah: ", (id_matakuliah) => {
            // Menampilkan daftar dosen
            const queryGetAllDosen = `SELECT nip, nama FROM dosen`;

            db.all(queryGetAllDosen, [], (err, dosenRows) => {
              if (err) {
                console.error("Error fetching dosen data: ", err.message);
                return KontrakController.menuKontrak(rl); // Kembali ke menu jika terjadi error
              }

              const tableDosen = new Table({
                head: ["NIP", "Nama Dosen"],
                colWidths: [10, 25],
              });

              dosenRows.forEach((row) => {
                tableDosen.push([row.nip, row.nama]);
              });

              console.log("\nDaftar Dosen:");
              console.log(tableDosen.toString());

              rl.question("Masukkan NIP Dosen: ", (nip) => {
                const insertQuery = `
                  INSERT INTO assignment (nim, id_matakuliah, nip, nilai)
                  VALUES (?, ?, ?, null)
                `;
                db.run(insertQuery, [nim, id_matakuliah, nip], (err) => {
                  if (err) {
                    console.error(
                      "Error saat menambahkan kontrak: ",
                      err.message
                    );
                    return KontrakController.menuKontrak(rl); // Kembali ke menu jika terjadi error
                  }

                  console.log("\nKontrak berhasil ditambahkan!");

                  // Menampilkan kontrak terbaru setelah ditambahkan
                  const queryGetAllKontrak = `
                    SELECT assignment.id, mahasiswa.nim, mahasiswa.nama, 
                           matakuliah.nama AS nama_matakuliah, dosen.nama AS nama_dosen, assignment.nilai
                    FROM assignment
                    JOIN mahasiswa ON assignment.nim = mahasiswa.nim
                    JOIN matakuliah ON assignment.id_matakuliah = matakuliah.id_matakuliah
                    JOIN dosen ON assignment.nip = dosen.nip
                  `;

                  db.all(queryGetAllKontrak, [], (err, kontrakRows) => {
                    if (err) {
                      console.error(
                        "Error fetching kontrak data: ",
                        err.message
                      );
                      return KontrakController.menuKontrak(rl); // Kembali ke menu jika terjadi error
                    }

                    const tableKontrak = new Table({
                      head: [
                        "ID",
                        "NIM",
                        "Nama",
                        "Mata Kuliah",
                        "Dosen",
                        "Nilai",
                      ],
                      colWidths: [5, 10, 25, 25, 20, 10],
                    });

                    kontrakRows.forEach((row) => {
                      tableKontrak.push([
                        row.id,
                        row.nim,
                        row.nama,
                        row.nama_matakuliah,
                        row.nama_dosen,
                        row.nilai != null ? row.nilai : "N/A",
                      ]);
                    });

                    console.log("\nData Kontrak Terbaru:");
                    console.log(tableKontrak.toString());
                    return KontrakController.menuKontrak(rl); // Kembali ke menu
                  });
                });
              });
            });
          });
        });
      });
    });
  },

  deleteKontrak: (rl) => {
    rl.question("Masukkan ID Kontrak yang akan dihapus: ", (id) => {
      const queryCheckID = "SELECT id FROM assignment WHERE id = ?";
      db.get(queryCheckID, [id], (err, row) => {
        if (err) {
          console.error("Error saat memeriksa ID kontrak: ", err.message);
          return KontrakController.menuKontrak(rl);
        }
        if (!row) {
          console.log(`Kontrak dengan ID '${id}' tidak ditemukan.`);
          return KontrakController.menuKontrak(rl);
        }
        const queryDeleteKontrak = "DELETE FROM assignment WHERE id = ?";
        db.run(queryDeleteKontrak, [id], (err) => {
          if (err) {
            console.error("Error saat menghapus kontrak: ", err.message);
            return KontrakController.menuKontrak(rl);
          }
          console.log(`Kontrak dengan ID '${id}' telah dihapus.`);
          return KontrakController.menuKontrak(rl);
        });
      });
    });
  },
  updateNilaiKontrak: (rl) => {
    const queryGetAllKontrak = `
      SELECT assignment.id, mahasiswa.nim, mahasiswa.nama, 
             matakuliah.nama AS nama_matkul, dosen.nama AS nama_dosen, assignment.nilai
      FROM assignment
      JOIN mahasiswa ON assignment.nim = mahasiswa.nim
      JOIN matakuliah ON assignment.id_matakuliah = matakuliah.id_matakuliah
      JOIN dosen ON assignment.nip = dosen.nip
    `;

    db.all(queryGetAllKontrak, [], (err, kontrakRows) => {
      if (err) {
        console.error("Error saat mengambil daftar kontrak:", err.message);
        return KontrakController.menuKontrak(rl); // Kembali ke menu jika terjadi error
      }

      const tableKontrak = new Table({
        head: ["ID", "NIM", "Nama", "Mata Kuliah", "Dosen", "Nilai"],
        colWidths: [5, 10, 25, 25, 20, 10],
      });

      kontrakRows.forEach((row) => {
        tableKontrak.push([
          row.id,
          row.nim,
          row.nama,
          row.nama_matkul,
          row.nama_dosen,
          row.nilai != null ? row.nilai : "",
        ]);
      });

      console.log("\nDaftar Kontrak Mahasiswa:");
      console.log(tableKontrak.toString());

      rl.question("Masukkan NIM Mahasiswa: ", (nim) => {
        const queryGetDetailKontrak = `
          SELECT assignment.id, matakuliah.nama AS nama_matkul, assignment.nilai
          FROM assignment
          JOIN matakuliah ON assignment.id_matakuliah = matakuliah.id_matakuliah
          WHERE assignment.nim = ?
        `;

        db.all(queryGetDetailKontrak, [nim], (err, rows) => {
          if (err) {
            console.error(
              "Error saat mengambil data kontrak mahasiswa:",
              err.message
            );
            return KontrakController.menuKontrak(rl);
          }
          if (rows.length === 0) {
            console.log(
              `Mahasiswa dengan NIM '${nim}' tidak memiliki kontrak.`
            );
            return updateNilaiKontrak(rl); // Kembali ke fungsi update jika tidak ada kontrak
          }

          const tableDetailKontrak = new Table({
            head: ["ID", "Mata Kuliah", "Nilai"],
            colWidths: [5, 25, 10],
          });

          rows.forEach((row) => {
            tableDetailKontrak.push([
              row.id,
              row.nama_matkul,
              row.nilai != null ? row.nilai : "",
            ]);
          });

          console.log(`\nDetail Mahasiswa dengan NIM '${nim}':`);
          console.log(tableDetailKontrak.toString());

          rl.question("Masukkan ID yang akan diubah nilainya: ", (id) => {
            rl.question("Masukkan nilai yang baru: ", (newNilai) => {
              const queryUpdateNilai = `
                UPDATE assignment
                SET nilai = ?
                WHERE id = ?
              `;

              db.run(queryUpdateNilai, [newNilai, id], (err) => {
                if (err) {
                  console.error(
                    `Gagal memperbarui nilai untuk ID ${id}:`,
                    err.message
                  );
                  return KontrakController.menuKontrak(rl); // Kembali ke menu jika terjadi error
                }

                console.log(`\nNilai berhasil diperbarui untuk ID ${id}.`);

                db.all(queryGetAllKontrak, [], (err, updatedRows) => {
                  if (err) {
                    console.error(
                      "Error saat mengambil daftar kontrak yang diperbarui:",
                      err.message
                    );
                    return KontrakController.menuKontrak(rl); // Kembali ke menu jika terjadi error
                  }

                  const updatedTableKontrak = new Table({
                    head: [
                      "ID",
                      "NIM",
                      "Nama",
                      "Mata Kuliah",
                      "Dosen",
                      "Nilai",
                    ],
                    colWidths: [5, 10, 25, 25, 20, 10],
                  });

                  updatedRows.forEach((row) => {
                    updatedTableKontrak.push([
                      row.id,
                      row.nim,
                      row.nama,
                      row.nama_matkul,
                      row.nama_dosen,
                      row.nilai != null ? row.nilai : "",
                    ]);
                  });

                  console.log("\nDaftar Kontrak Mahasiswa yang Diperbarui:");
                  console.log(updatedTableKontrak.toString());
                  KontrakController.menuKontrak(rl); // Kembali ke menu setelah selesai
                });
              });
            });
          });
        });
      });
    });
  },
};
