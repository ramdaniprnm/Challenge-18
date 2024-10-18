const sqlite3 = require("sqlite3").verbose();
const readline = require("readline");
const db = new sqlite3.Database("university.db");
const Table = require("cli-table");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const mainMenu = () => {
  console.log("\n===================== MAIN MENU =====================");
  console.log("[1]. Mahasiswa");
  console.log("[2]. Jurusan");
  console.log("[3]. Dosen");
  console.log("[4]. Matakuliah");
  console.log("[5]. Kontrak");
  console.log("[6]. Logout");

  rl.question("Masukan salah satu nomor dari opsi diatas: ", (option) => {
    switch (option) {
      case "1":
        mahasiswaMenu();
        break;
      case "2":
        jurusanMenu();
        break;
      case "3":
        dosenMenu();
        break;
      case "4":
        matakuliahMenu();
        break;
      case "5":
        kontrakMenu();
        break;
      case "6":
        console.log("Sign Out!");
        db.close();
        rl.close();
        process.exit();
      default:
        console.log("Option is not valid");
        mainMenu();
    }
  });
};

const mahasiswaMenu = () => {
  console.log(`\n===================== *MAHASISWA MENU* =====================`);
  console.log(`Silahkan pilih Opsi di bawah ini`);
  console.log("[1]. Daftar Mahasiswa");
  console.log("[2]. Cari Mahasiswa");
  console.log("[3]. Tambah Mahasiswa");
  console.log("[4]. Hapus Mahasiswa");
  console.log("[5]. kembali");
  console.log(`============================================================`);
  rl.question("Masukan salah satu nomor dari opsi diatas: ", (option) => {
    switch (option) {
      case "1":
        listMahasiswa();
        break;
      case "2":
        searchMahasiswa();
        break;
      case "3":
        addMahasiswa();
        break;
      case "4":
        deleteMahasiswa();
        break;
      case "5":
        mainMenu();
        break;
      default:
        console.log("Option is not valid");
        mahasiswaMenu();
    }
  });
};

const listMahasiswa = () => {
  const query = `
    SELECT mahasiswa.nim, mahasiswa.nama, mahasiswa.tgl_lahir AS tgllahir, mahasiswa.alamat, 
           jurusan.id_jurusan AS id_jurusan, jurusan.nama_jurusan AS namajurusan
    FROM mahasiswa
    LEFT JOIN jurusan ON mahasiswa.id_jurusan = jurusan.id_jurusan
  `;

  // Execute the query
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error saat mengambil data mahasiswa: ", err.message);
      return mahasiswaMenu();
    }

    const table = new Table({
      head: [
        "NIM",
        "Nama",
        "tanggal Lahir",
        "Alamat",
        "Kode Jurusan",
        "Nama Jurusan",
      ],
      colWidths: [10, 25, 15, 30, 15, 30],
    });

    rows.forEach((row) => {
      table.push([
        row.nim,
        row.nama,
        row.tgllahir,
        row.alamat,
        row.id_jurusan,
        row.namajurusan,
      ]);
    });

    console.log(table.toString());
    mahasiswaMenu();
  });
};

const searchMahasiswa = () => {
  rl.question("Masukkan NIM Mahasiswa: ", (NIM) => {
    const query = `SELECT mahasiswa.nim, mahasiswa.nama, mahasiswa.tgl_lahir AS tgllahir, mahasiswa.alamat, 
             jurusan.id_jurusan AS id_jurusan, jurusan.nama_jurusan AS namajurusan
      FROM mahasiswa
      LEFT JOIN jurusan ON mahasiswa.id_jurusan = jurusan.id_jurusan
      WHERE mahasiswa.nim = ?`;

    db.get(query, [NIM], (err, row) => {
      if (err) {
        console.log("Error saat mengambil data Mahasiswa: ");
        return mahasiswaMenu();
      }
      if (row) {
        console.log("\n=============================================");
        console.log(`Detail mahasiswa dengan NIM '${NIM}':`);
        console.log(`NIM          : ${row.nim}`);
        console.log(`Nama         : ${row.nama}`);
        console.log(`Tanggal Lahir: ${row.tgllahir}`);
        console.log(`Alamat       : ${row.alamat}`);
        console.log(`Kode Jurusan : ${row.id_jurusan}`);
        console.log(`Nama Jurusan : ${row.namajurusan}`);
        console.log("=============================================");
      } else {
        console.log(`\nMahasiswa dengan NIM '${NIM}', tidak terdaftar.`);
      }
      mahasiswaMenu();
    });
  });
};

// FITUR ADD MAHASISWA
const addMahasiswa = () => {
  const queryGetAllMahasiswa = `
    SELECT m.nim, m.nama, m.tgl_lahir, m.alamat, m.id_jurusan, j.nama_jurusan 
    FROM mahasiswa m
    JOIN jurusan j ON m.id_jurusan = j.id_jurusan
  `;

  db.all(queryGetAllMahasiswa, [], (err, mahasiswaRows) => {
    if (err) {
      console.error("Error saat mengambil data mahasiswa: ", err.message);
      return mahasiswaMenu();
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
    console.log("Lengkapi data di bawah ini untuk menambahkan mahasiswa baru.");
    rl.question("NIM: ", (nim) => {
      const queryCheckNIM = "SELECT nim FROM mahasiswa WHERE nim = ?";
      // Check jika NIM sudah ada
      db.get(queryCheckNIM, [nim], (err, row) => {
        if (err) {
          console.error("Error saat memeriksa NIM: ", err.message);
          return mahasiswaMenu();
        }

        if (row) {
          console.log(
            `Mahasiswa dengan NIM '${nim}' sudah ada. Silahkan coba lagi.`
          );
          return mahasiswaMenu();
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
                  return mahasiswaMenu();
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
                        return mahasiswaMenu();
                      }

                      console.log(
                        `\nMahasiswa dengan NIM '${nim}' telah ditambahkan.`
                      );
                      listMahasiswa();
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
};

const deleteMahasiswa = () => {
  rl.question("Masukkan NIM Mahasiswa yang akan dihapus: ", (nim) => {
    // Cek NIM mahasiswa
    const queryCheckNIM = "SELECT nim FROM mahasiswa WHERE nim = ?";

    db.get(queryCheckNIM, [nim], (err, row) => {
      if (err) {
        console.error("Error saat memeriksa NIM: ", err.message);
        return mahasiswaMenu();
      }

      if (!row) {
        console.log(`Mahasiswa dengan NIM '${nim}' tidak ditemukan.`);
        return mahasiswaMenu();
      }
      // Jika NIM ditemukan, lakukan penghapusan
      const queryDeleteMahasiswa = "DELETE FROM mahasiswa WHERE nim = ?";
      db.run(queryDeleteMahasiswa, [nim], (err) => {
        if (err) {
          console.error("Error saat menghapus mahasiswa: ", err.message);
          return mahasiswaMenu();
        }
        console.log(`Data Mahasiswa dengan NIM '${nim}' telah dihapus.`);
        mahasiswaMenu();
      });
    });
  });
};

const jurusanMenu = () => {
  console.log(`\n===================== *JURUSAN MENU* =====================`);
  console.log(`Silahkan pilih Opsi di bawah ini`);
  console.log("[1]. Daftar Jurusan");
  console.log("[2]. Cari Jurusan");
  console.log("[3]. Tambah Jurusan");
  console.log("[4]. Hapus Jurusan");
  console.log("[5]. kembali");
  console.log(`============================================================`);
  rl.question("Masukan salah satu nomor dari opsi diatas: ", (option) => {
    switch (option) {
      case "1":
        listJurusan();
        break;
      case "2":
        searchJurusan();
        break;
      case "3":
        addJurusan();
        break;
      case "4":
        deleteJurusan();
        break;
      case "5":
        mainMenu();
        break;
      default:
        console.log("Option is not valid");
        mahasiswaMenu();
    }
  });
};

const listJurusan = () => {
  const query = `SELECT * FROM jurusan`;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error saat mengambil data jurusan: ", err.message);
      return jurusanMenu();
    }
    const table = new Table({
      head: ["Kode Jurusan", "Nama Jurusan"],
      colWidths: [15, 30],
    });
    rows.forEach((row) => {
      table.push([row.id_jurusan, row.nama_jurusan]);
    });
    console.log(table.toString());
    jurusanMenu();
  });
};

const searchJurusan = () => {
  rl.question("Masukkan Kode Jurusan: ", (id_jurusan) => {
    const query = `
      SELECT * 
      FROM jurusan
      WHERE id_jurusan = ?
    `;
    db.get(query, [id_jurusan], (err, row) => {
      if (err) {
        console.log("Error saat mengambil data Jurusan: ", err.message);
        return jurusanMenu();
      }
      if (row) {
        console.log("\n=============================================");
        console.log(`Detail jurusan dengan Kode Jurusan '${id_jurusan}':`);
        console.log(`Kode Jurusan : ${row.id_jurusan}`);
        console.log(`Nama Jurusan : ${row.nama_jurusan}`);
        console.log("=============================================");
      } else {
        console.log(
          `\nJurusan dengan Kode Jurusan '${id_jurusan}', tidak ditemukan.`
        );
      }
      jurusanMenu();
    });
  });
};

const addJurusan = () => {
  console.log("Lengkapi data di bawah ini untuk menambahkan jurusan baru.");
  rl.question("Kode Jurusan: ", (id_jurusan) => {
    const queryCheckJurusan =
      "SELECT id_jurusan FROM jurusan WHERE id_jurusan = ?";
    // cek apakah id jurusan sudah ada
    db.get(queryCheckJurusan, [id_jurusan], (err, row) => {
      if (err) {
        console.error("Error saat memeriksa Kode Jurusan: ", err.message);
        return jurusanMenu();
      }

      if (row) {
        console.log(
          `Jurusan dengan Kode '${id_jurusan}' sudah ada. Silahkan coba lagi.`
        );
        return jurusanMenu();
      }

      rl.question("Nama Jurusan: ", (nama_jurusan) => {
        const queryAddJurusan = `
          INSERT INTO jurusan (id_jurusan, nama_jurusan)
          VALUES (?, ?)
        `;
        // Masukkan jurusan baru ke database
        db.run(queryAddJurusan, [id_jurusan, nama_jurusan], (err) => {
          if (err) {
            console.error("Error saat menambahkan jurusan: ", err.message);
            return jurusanMenu();
          }
          console.log(
            `\nJurusan dengan Kode '${id_jurusan}' telah ditambahkan.`
          );
          listJurusan();
        });
      });
    });
  });
};

const deleteJurusan = () => {
  console.log("Hapus Jurusan");

  rl.question("Masukkan Kode Jurusan: ", (id_jurusan) => {
    const queryCheckJurusan =
      "SELECT id_jurusan FROM jurusan WHERE id_jurusan = ?";

    // Cek apakah jurusan dengan kode tersebut ada
    db.get(queryCheckJurusan, [id_jurusan], (err, row) => {
      if (err) {
        console.error("Error saat memeriksa Kode Jurusan: ", err.message);
        return jurusanMenu();
      }

      if (!row) {
        console.log(`Jurusan dengan Kode '${id_jurusan}' tidak ditemukan.`);
        return jurusanMenu();
      }

      const queryDeleteJurusan = `DELETE FROM jurusan WHERE id_jurusan = ?`;

      db.run(queryDeleteJurusan, [id_jurusan], (err) => {
        if (err) {
          console.error("Error saat menghapus jurusan: ", err.message);
          return jurusanMenu();
        }

        console.log(`Jurusan dengan Kode '${id_jurusan}' telah dihapus.`);
        listJurusan();
      });
    });
  });
};

const dosenMenu = () => {
  console.log(`\n===================== *DOSEN MENU* =====================`);
  console.log(`Silahkan pilih Opsi di bawah ini`);
  console.log("[1]. Daftar Dosen");
  console.log("[2]. Cari Dosen");
  console.log("[3]. Tambah Dosen");
  console.log("[4]. Hapus Dosen");
  console.log("[5]. Kembali");
  console.log(`========================================================`);

  rl.question("Masukkan salah satu nomor dari opsi di atas: ", (option) => {
    switch (option) {
      case "1":
        listDosen();
        break;
      case "2":
        searchDosen();
        break;
      case "3":
        addDosen();
        break;
      case "4":
        deleteDosen();
        break;
      case "5":
        console.log("Kembali ke menu utama.");
        mainMenu();
        break;
      default:
        console.log("Opsi tidak valid, silahkan coba lagi.");
        dosenMenu();
    }
  });
};

const listDosen = () => {
  const query = `
    SELECT nip, nama
    FROM dosen
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error saat mengambil data dosen: ", err.message);
      return dosenMenu();
    }

    const table = new Table({
      head: ["NIP", "Nama Dosen"],
      colWidths: [15, 30],
    });

    rows.forEach((row) => {
      table.push([row.nip, row.nama]);
    });

    console.log(table.toString());
    dosenMenu();
  });
};

const searchDosen = () => {
  rl.question("Masukkan NIP Dosen: ", (NIP) => {
    const query = `SELECT nip, nama FROM dosen WHERE nip = ?`;

    db.get(query, [NIP], (err, row) => {
      if (err) {
        console.error("Error saat mencari dosen: ", err.message);
        return dosenMenu();
      }

      if (row) {
        console.log("\n=============================================");
        console.log(`Detail dosen dengan NIP '${NIP}':`);
        console.log(`NIP  : ${row.nip}`);
        console.log(`Nama : ${row.nama}`);
        console.log("=============================================");
      } else {
        console.log(`\nDosen dengan NIP '${NIP}' tidak ditemukan.`);
      }

      dosenMenu();
    });
  });
};

const addDosen = () => {
  console.log("Tambah Dosen");

  rl.question("Masukkan NIP: ", (NIP) => {
    const queryCheckNIP = "SELECT nip FROM dosen WHERE nip = ?";

    // Cek dosen dengan NIP yang exist pada database
    db.get(queryCheckNIP, [NIP], (err, row) => {
      if (err) {
        console.error("Error saat memeriksa NIP: ", err.message);
        return dosenMenu();
      }

      if (row) {
        console.log(`Dosen dengan NIP '${NIP}' sudah terdaftar.`);
        return dosenMenu();
      }

      rl.question("Masukkan Nama Dosen: ", (nama) => {
        const queryAddDosen = `
          INSERT INTO dosen (nip, nama)
          VALUES (?, ?)
        `;

        db.run(queryAddDosen, [NIP, nama], (err) => {
          if (err) {
            console.error("Error saat menambahkan dosen: ", err.message);
            return dosenMenu();
          }

          console.log(`Dosen dengan NIP '${NIP}' telah berhasil ditambahkan.`);
          listDosen(); //  dosen yang telah diperbarui
        });
      });
    });
  });
};

const deleteDosen = () => {
  console.log("Hapus Dosen");

  rl.question("Masukkan NIP Dosen: ", (NIP) => {
    const queryCheckNIP = "SELECT nip FROM dosen WHERE nip = ?";

    // Cek dosen yang NIP exist pada db
    db.get(queryCheckNIP, [NIP], (err, row) => {
      if (err) {
        console.error("Error saat memeriksa NIP: ", err.message);
        return dosenMenu();
      }

      if (!row) {
        console.log(`Dosen dengan NIP '${NIP}' tidak ditemukan.`);
        return dosenMenu();
      }

      const queryDeleteDosen = `DELETE FROM dosen WHERE nip = ?`;

      db.run(queryDeleteDosen, [NIP], (err) => {
        if (err) {
          console.error("Error saat menghapus dosen: ", err.message);
          return dosenMenu();
        }

        console.log(`Dosen dengan NIP '${NIP}' telah dihapus.`);
        listDosen(); // Tampilkan daftar dosen setelah delet
      });
    });
  });
};

const matakuliahMenu = () => {
  console.log(
    `\n===================== *MATAKULIAH MENU* =====================`
  );
  console.log(`Silahkan pilih Opsi di bawah ini`);
  console.log("[1]. Daftar Matakuliah");
  console.log("[2]. Cari Matakuliah");
  console.log("[3]. Tambah Matakuliah");
  console.log("[4]. Hapus Matakuliah");
  console.log("[5]. Kembali");
  console.log(`============================================================`);

  rl.question("Masukkan salah satu nomor dari opsi di atas: ", (option) => {
    switch (option) {
      case "1":
        listMatakuliah();
        break;
      case "2":
        searchMatakuliah();
        break;
      case "3":
        addMatakuliah();
        break;
      case "4":
        deleteMatakuliah();
        break;
      case "5":
        console.log("Kembali ke menu utama.");
        mainMenu();
        break;
      default:
        console.log("Opsi tidak valid, silahkan coba lagi.");
        matakuliahMenu();
    }
  });
};

const listMatakuliah = () => {
  const query = `
    SELECT id_matakuliah, nama, sks
    FROM matakuliah
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error saat mengambil data mata kuliah: ", err.message);
      return matakuliahMenu();
    }

    const table = new Table({
      head: ["ID Mata Kuliah", "Nama Mata Kuliah", "SKS"],
      colWidths: [20, 30, 15],
    });

    rows.forEach((row) => {
      table.push([row.id_matakuliah, row.nama, row.sks]);
    });

    console.log(table.toString());
    matakuliahMenu();
  });
};

const searchMatakuliah = () => {
  rl.question("Masukkan ID Mata Kuliah: ", (id_matakuliah) => {
    const query = `SELECT id_matakuliah, sks, nama FROM matakuliah WHERE id_matakuliah = ?`;
    db.get(query, [id_matakuliah], (err, row) => {
      if (err) {
        console.error("Error saat mencari mata kuliah: ", err.message);
        return matakuliahMenu();
      }

      if (row) {
        console.log("\n=============================================");
        console.log(`Detail mata kuliah dengan ID '${id_matakuliah}':`);
        console.log(`ID Mata Kuliah  : ${row.id_matakuliah}`);
        console.log(`Nama Mata Kuliah: ${row.nama}`);
        console.log(`SKS Mata Kuliah: ${row.sks}`);
        console.log("=============================================");
      } else {
        console.log(
          `\nMata kuliah dengan ID '${id_matakuliah}' tidak ditemukan.`
        );
      }
      matakuliahMenu();
    });
  });
};

const addMatakuliah = () => {
  console.log("Tambah Mata Kuliah");

  rl.question("Masukkan ID Mata Kuliah: ", (id_matakuliah) => {
    const queryCheckID =
      "SELECT id_matakuliah FROM matakuliah WHERE id_matakuliah = ?";

    // Cek mata kuliah dengan ID jika exist pada db
    db.get(queryCheckID, [id_matakuliah], (err, row) => {
      if (err) {
        console.error("Error saat memeriksa ID Mata Kuliah: ", err.message);
        return matakuliahMenu();
      }

      if (row) {
        console.log(
          `Mata kuliah dengan ID '${id_matakuliah}' sudah terdaftar.`
        );
        return matakuliahMenu();
      }

      rl.question("Masukkan Nama Mata Kuliah: ", (nama) => {
        rl.question("Masukkan SKS Mata Kuliah: ", (sks) => {
          const queryAddMatakuliah = `
          INSERT INTO matakuliah (id_matakuliah, nama, sks)
          VALUES (?, ?, ?)
        `;

          db.run(queryAddMatakuliah, [id_matakuliah, nama, sks], (err) => {
            if (err) {
              console.error(
                "Error saat menambahkan mata kuliah: ",
                err.message
              );
              return matakuliahMenu();
            }
            console.log(
              `Mata kuliah dengan ID '${id_matakuliah}' telah berhasil ditambahkan.`
            );
            listMatakuliah(); // Tampilkan daftar mata kuliah yang telah diperbarui
          });
        });
      });
    });
  });
};

const deleteMatakuliah = () => {
  console.log("Hapus Mata Kuliah");
  rl.question("Masukkan ID Mata Kuliah: ", (id_matakuliah) => {
    const queryCheckID =
      "SELECT id_matakuliah FROM matakuliah WHERE id_matakuliah = ?";
    // Cek apakah mata kuliah dengan ID tersebut ada
    db.get(queryCheckID, [id_matakuliah], (err, row) => {
      if (err) {
        console.error("Error saat memeriksa ID Mata Kuliah: ", err.message);
        return matakuliahMenu();
      }
      if (!row) {
        console.log(
          `Mata kuliah dengan ID '${id_matakuliah}' tidak ditemukan.`
        );
        return matakuliahMenu();
      }
      const queryDeleteMatakuliah = `DELETE FROM matakuliah WHERE id_matakuliah = ?`;

      db.run(queryDeleteMatakuliah, [id_matakuliah], (err) => {
        if (err) {
          console.error("Error saat menghapus mata kuliah: ", err.message);
          return matakuliahMenu();
        }

        console.log(`Mata kuliah dengan ID '${id_matakuliah}' telah dihapus.`);
        listMatakuliah(); // Tampilkan daftar mata kuliah setelah penghapusan
      });
    });
  });
};

const kontrakMenu = () => {
  console.log(`\n===================== *KONTRAK MENU* =====================`);
  console.log(`Silahkan pilih Opsi di bawah ini`);
  console.log("[1]. Daftar Kontrak");
  console.log("[2]. Cari Kontrak");
  console.log("[3]. Tambah Kontrak");
  console.log("[4]. Hapus Kontrak");
  console.log("[5]. Update Nilai");
  console.log("[6]. Kembali");
  console.log(`============================================================`);

  rl.question("Masukkan salah satu nomor dari opsi diatas: ", (option) => {
    switch (option) {
      case "1":
        listKontrak();
        break;
      case "2":
        searchKontrak();
        break;
      case "3":
        addKontrak();
        break;
      case "4":
        deleteKontrak();
        break;
      case "5":
        updateNilaiKontrak();
        break;
      case "6":
        mainMenu();
        break;
      default:
        console.log("Pilihan tidak valid, silakan coba lagi.");
        kontrakMenu();
    }
  });
};

const listKontrak = () => {
  const query = `
    SELECT mahasiswa.nim, mahasiswa.nama, matakuliah.nama AS nama_matkul, 
           dosen.nama AS nama_dosen, assignment.nilai, assignment.id
    FROM assignment
    JOIN mahasiswa ON assignment.nim = mahasiswa.nim
    JOIN matakuliah ON assignment.id_matakuliah = matakuliah.id_matakuliah
    JOIN dosen ON assignment.nip = dosen.nip
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error saat mengambil data kontrak: ", err.message);
      return kontrakMenu();
    }

    const tableKontrak = new Table({
      head: ["ID", "NIM", "Nama", "Mata Kuliah", "Nama Dosen", "Nilai"],
      colWidths: [5, 10, 25, 20, 20, 10],
    });

    rows.forEach((row) => {
      tableKontrak.push([
        row.id,
        row.nim,
        row.nama,
        row.nama_matkul,
        row.nama_dosen,
        row.nilai != null ? row.nilai : "",
      ]);
    });
    console.log(tableKontrak.toString());
    kontrakMenu();
  });
};

const searchKontrak = () => {
  db.all(
    `
    SELECT mahasiswa.nim, mahasiswa.nama, mahasiswa.tgl_lahir, mahasiswa.alamat, 
           jurusan.id_jurusan, jurusan.nama_jurusan
    FROM mahasiswa
    LEFT JOIN jurusan ON mahasiswa.id_jurusan = jurusan.id_jurusan
    `,
    (err, rows) => {
      if (err) {
        console.error("Error fetching mahasiswa data:", err);
        return kontrakMenu();
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

      rl.question("Masukkan NIM Mahasiswa: ", (nim) => {
        db.all(
          `
          SELECT assignment.id, assignment.nim, mahasiswa.nama, matakuliah.nama AS nama_matakuliah, 
                 dosen.nama AS nama_dosen, assignment.nilai
          FROM assignment
          JOIN mahasiswa ON assignment.nim = mahasiswa.nim
          JOIN matakuliah ON assignment.id_matakuliah = matakuliah.id_matakuliah
          JOIN dosen ON assignment.nip = dosen.nip
          WHERE assignment.nim = ?
          `,
          [nim],
          (err, rows) => {
            if (err) {
              console.error("Error fetching assignment data:", err);
              return kontrakMenu();
            }

            if (rows.length === 0) {
              console.log(
                `\nMahasiswa dengan NIM '${nim}' tidak memiliki kontrak.`
              );
              return searchKontrak();
            }

            console.log(
              `\nDaftar kontrak mahasiswa dengan NIM '${nim}' adalah:`
            );

            const tableAssignment = new Table({
              head: ["ID", "NIM", "Nama", "Mata Kuliah", "Nama Dosen", "Nilai"],
              colWidths: [5, 10, 25, 20, 20, 10],
            });

            rows.forEach((row) => {
              tableAssignment.push([
                row.id,
                row.nim,
                row.nama,
                row.nama_matakuliah,
                row.nama_dosen,
                row.nilai != null ? row.nilai : "",
              ]);
            });
            console.log(tableAssignment.toString());
            kontrakMenu();
          }
        );
      });
    }
  );
};

const addKontrak = () => {
  db.all(
    `
    SELECT mahasiswa.nim, mahasiswa.nama, mahasiswa.tgl_lahir, mahasiswa.alamat, 
           jurusan.id_jurusan, jurusan.nama_jurusan
    FROM mahasiswa
    LEFT JOIN jurusan ON mahasiswa.id_jurusan = jurusan.id_jurusan
    `,
    (err, rows) => {
      if (err) {
        console.error("Error fetching mahasiswa data:", err);
        return kontrakMenu();
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

      // Pertanyaan untuk memilih mahasiswa berdasarkan NIM
      rl.question("Masukkan NIM Mahasiswa: ", (nim) => {
        db.all(
          `SELECT id_matakuliah, nama, sks FROM matakuliah`,
          [],
          (err, matkulRows) => {
            if (err) {
              console.error("Error fetching matakuliah data:", err);
              return kontrakMenu();
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

            rl.question("Masukkan Kode Matakuliah: ", (id_matakuliah) => {
              db.all(`SELECT nip, nama FROM dosen`, [], (err, dosenRows) => {
                if (err) {
                  console.error("Error fetching dosen data:", err);
                  return kontrakMenu();
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
                  db.run(
                    insertQuery,
                    [nim, id_matakuliah, nip],
                    function (err) {
                      if (err) {
                        console.error(
                          "Error saat menambahkan kontrak:",
                          err.message
                        );
                        return kontrakMenu();
                      }
                      console.log("\nKontrak telah ditambahkan!");
                      db.all(
                        `
                          SELECT assignment.id, mahasiswa.nim, mahasiswa.nama, 
                          matakuliah.nama AS nama_matkul, dosen.nama AS nama_dosen, assignment.nilai
                          FROM assignment
                          JOIN mahasiswa ON assignment.nim = mahasiswa.nim
                          JOIN matakuliah ON assignment.id_matakuliah = matakuliah.id_matakuliah
                          JOIN dosen ON assignment.nip = dosen.nip
                          `,
                        (err, kontrakRows) => {
                          if (err) {
                            console.error(
                              "Error fetching updated kontrak data:",
                              err
                            );
                            return kontrakMenu();
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
                              row.nama_matkul,
                              row.nama_dosen,
                              row.nilai != null ? row.nilai : "",
                            ]);
                          });
                          console.log("\nData Kontrak Terbaru:");
                          console.log(tableKontrak.toString());
                          kontrakMenu();
                        }
                      );
                    }
                  );
                });
              });
            });
          }
        );
      });
    }
  );
};

const deleteKontrak = () => {
  rl.question("Masukkan ID Kontrak: ", (id) => {
    db.run(`DELETE FROM assignment WHERE id = ?`, [id], function (err) {
      if (err) {
        console.error(`Gagal menghapus Kontrak dengan ID ${id}:`, err.message);
      } else if (this.changes === 0) {
        console.log(`Tidak ada Kontrak yang ditemukan dengan ID ${id}.`);
      } else {
        console.log(`Kontrak ID ${id} berhasil dihapus.`);
      }
      kontrakMenu();
    });
  });
};

const updateNilaiKontrak = () => {
  db.all(
    `
    SELECT assignment.id, mahasiswa.nim, mahasiswa.nama, 
           matakuliah.nama AS nama_matkul, dosen.nama AS nama_dosen, assignment.nilai
    FROM assignment
    JOIN mahasiswa ON assignment.nim = mahasiswa.nim
    JOIN matakuliah ON assignment.id_matakuliah = matakuliah.id_matakuliah
    JOIN dosen ON assignment.nip = dosen.nip
  `,
    [],
    (err, kontrakRows) => {
      if (err) {
        console.error("Error saat mengambil daftar kontrak:", err.message);
        return kontrakMenu();
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
        db.all(
          `
        SELECT assignment.id, matakuliah.nama AS nama_matkul, assignment.nilai
        FROM assignment
        JOIN matakuliah ON assignment.id_matakuliah = matakuliah.id_matakuliah
        WHERE assignment.nim = ?
      `,
          [nim],
          (err, rows) => {
            if (err) {
              console.error(
                "Error saat mengambil data kontrak mahasiswa:",
                err.message
              );
              return kontrakMenu();
            }
            if (rows.length === 0) {
              console.log(
                `Mahasiswa dengan NIM '${nim}' tidak memiliki kontrak.`
              );
              return updateNilaiKontrak();
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
                db.run(
                  `
              UPDATE assignment
              SET nilai = ?
              WHERE id = ?
            `,
                  [newNilai, id],
                  (err) => {
                    if (err) {
                      console.error(
                        `Gagal memperbarui nilai untuk ID ${id}:`,
                        err.message
                      );
                      return kontrakMenu();
                    }

                    console.log(
                      `\nNilai telah berhasil diperbarui untuk ID ${id}.`
                    );
                    db.all(
                      `
                SELECT assignment.id, mahasiswa.nim, mahasiswa.nama, 
                       matakuliah.nama AS nama_matkul, dosen.nama AS nama_dosen, assignment.nilai
                FROM assignment
                JOIN mahasiswa ON assignment.nim = mahasiswa.nim
                JOIN matakuliah ON assignment.id_matakuliah = matakuliah.id_matakuliah
                JOIN dosen ON assignment.nip = dosen.nip
              `,
                      [],
                      (err, updatedRows) => {
                        if (err) {
                          console.error(
                            "Error saat mengambil daftar kontrak yang diperbarui:",
                            err.message
                          );
                          return kontrakMenu();
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

                        console.log(
                          "\nDaftar Kontrak Mahasiswa yang Diperbarui:"
                        );
                        console.log(updatedTableKontrak.toString());
                        kontrakMenu();
                      }
                    );
                  }
                );
              });
            });
          }
        );
      });
    }
  );
};

// Fungsi untuk menanyakan Username
const askUsername = (callback) => {
  rl.question("username: ", (username) => {
    callback(username);
  });
};

// Fungsi untuk menanyakan password
const askPassword = (callback) => {
  rl.question("password: ", (password) => {
    callback(password);
  });
};

// Fungsi untuk login
const loginPage = () => {
  console.log("==============================================");
  console.log("Welcome to Universitas LangLang");
  console.log("Jl. Rusuk Tusuk NO. 01");
  console.log("==============================================");

  const askForLogin = () => {
    askUsername((username) => {
      db.get(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, userRow) => {
          if (err) {
            console.error("Error tidak bisa membaca Database", err);
            rl.close();
          } else if (!userRow) {
            console.log("username tidak terdaftar");
            askForLogin();
          } else {
            let attempts = 0;
            const checkPassword = () => {
              askPassword((password) => {
                if (userRow.password === password) {
                  console.log(
                    `\nWelcome, ${userRow.username}. Your access level is: ${userRow.role}`
                  );
                  mainMenu();
                } else {
                  attempts += 1;
                  if (attempts >= 5) {
                    console.log("Anda telah gagal login 5 kali. Anda keluar.");
                    rl.close();
                  } else {
                    console.log(`Password salah`);
                    checkPassword();
                  }
                }
              });
            };
            checkPassword();
          }
        }
      );
    });
  };
  askForLogin();
};
loginPage();
