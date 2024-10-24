import { db } from "./database/db.js";

export class dosenModel {
  static listDosen(callback) {
    const query = `SELECT * FROM dosen`;
    db.all(query, (err, rows) => {
      if (err) {
        console.error("Error dosen tidak terdeteksi: ", err.message);
        return callback(err, null);
      }
      callback(null, rows);
    });
  }

  static searchDosen(nip, callback) {
    const query = `
    SELECT * FROM dosen WHERE nip = ?`;
    db.get(query, [nip], (err, row) => {
      if (err) {
        console.error("Error searching jurusan: ", err.message);
        return callback(err, null);
      }
      callback(null, row);
    });
  }
  static addDosen(nama, nip, callback) {
    const queryAddjurusan = `
      INSERT INTO dosen (nama, nip)
      VALUES (?, ?)
    `;
    db.run(queryAddjurusan, [nama, nip], (err) => {
      if (err) {
        console.error("Error saat menambahkan jurusan: ", err.message);
        return callback(err);
      }
      callback(null);
    });
  }

  static deleteDosen(nip, callback) {
    const query = `
      DELETE FROM dosen WHERE nip = ?
    `;
    db.run(query, [nip], function (err) {
      if (err) {
        console.error(
          `Gagal menghapus jurusan dengan NIM ${nip}:`,
          err.message
        );
        return callback(err, null);
      }
      if (this.changes === 0) {
        console.log(`Tidak ada Dosen yang ditemukan dengan NIP ${nip}.`);
        return callback(null, null);
      }
      console.log(`Dosen dengan NIP ${nip} berhasil dihapus.`);
      callback(null, true);
    });
  }
}
