import { db } from "./database/db.js";

export class jurusanModel {
  static listJurusan(callback) {
    const query = `SELECT * FROM jurusan`;
    db.all(query, (err, rows) => {
      if (err) {
        console.error("Error jurusan tidak terdeteksi: ", err.message);
        return callback(err, null);
      }
      callback(null, rows);
    });
  }

  static searchJurusan(id_jurusan, callback) {
    const query = `
    SELECT * FROM jurusan WHERE id_jurusan = ?`;
    db.get(query, [id_jurusan], (err, row) => {
      if (err) {
        console.error("Error searching jurusan: ", err.message);
        return callback(err, null);
      }
      callback(null, row);
    });
  }
  static addJurusan(nama_jurusan, id_jurusan, callback) {
    const queryAddjurusan = `
      INSERT INTO jurusan (nama_jurusan, id_jurusan)
      VALUES (?, ?)
    `;
    db.run(queryAddjurusan, [nama_jurusan, id_jurusan], (err) => {
      if (err) {
        console.error("Error saat menambahkan jurusan: ", err.message);
        return callback(err);
      }
      callback(null);
    });
  }

  static deleteJurusan(id_jurusan, callback) {
    const query = `
      DELETE FROM jurusan WHERE id_jurusan = ?
    `;
    db.run(query, [id_jurusan], function (err) {
      if (err) {
        console.error(
          `Gagal menghapus jurusan dengan NIM ${id_jurusan}:`,
          err.message
        );
        return callback(err, null);
      }
      if (this.changes === 0) {
        console.log(
          `Tidak ada jurusan yang ditemukan dengan NIM ${id_jurusan}.`
        );
        return callback(null, null);
      }
      console.log(`jurusan dengan NIM ${id_jurusan} berhasil dihapus.`);
      callback(null, true);
    });
  }
}
