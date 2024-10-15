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
  console.log("[5]. Assignment");
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
        assignmentMenu();
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
