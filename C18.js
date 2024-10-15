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
        KontrakMenu();
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
  // Fetch and display the list of current mahasiswa
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
    // tuk menanyakan detail mahasiswa baru
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
        // Proceed with adding new mahasiswa if NIM doesn't exist
        rl.question("Nama: ", (nama) => {
          rl.question("Tanggal Lahir: ", (tgl_lahir) => {
            rl.question("Alamat: ", (alamat) => {
              // Fetch available jurusan
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

                  // menambahkan mahasiswa baru to database
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
                      listMahasiswa(); // Display updated list setelah menambahkan mahasiswa baru
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

// Fungsi untuk menanyakan username
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
            let attempts = 0; // Inisialisasi jumlah percobaan

            const checkPassword = () => {
              askPassword((password) => {
                if (userRow.password === password) {
                  console.log(
                    `\nWelcome, ${userRow.username}, Your access level is: ${userRow.access_level}`
                  );
                  mainMenu(); // Panggil menu Mahasiswa setelah login berhasil
                } else {
                  attempts += 1;
                  if (attempts >= 5) {
                    console.log(
                      "Anda telah gagal login 5 kali. Program keluar."
                    );
                    rl.close();
                  } else {
                    console.log(`Password salah`);
                    checkPassword(); // Mengulang permintaan password
                  }
                }
              });
            };

            checkPassword(); // Mulai cek password pertama kali
          }
        }
      );
    });
  };

  askForLogin();
};

// Memulai proses login
loginPage();
