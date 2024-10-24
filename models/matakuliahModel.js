import { db } from "./database/db.js";

export class matakuliahModel {
  static listMatakuliah(callback) {
    const query = `SELECT * FROM matakuliah`;
    db.all(query, (err, rows) => {
      if (err) {
        console.error("Error matakuliah tidak terdeteksi: ", err.message);
        return callback(err, null);
      }
      callback(null, rows);
    });
  }

  static searchMatakuliah(nip, callback) {
    const query = `
    SELECT * FROM matakuliah WHERE id_matakuliah = ?`;
    db.get(query, [nip], (err, row) => {
      if (err) {
        console.error("Error searching jurusan: ", err.message);
        return callback(err, null);
      }
      callback(null, row);
    });
  }
  static addMatakuliah(nama, id_matakuliah, sks, callback) {
    const queryAddjurusan = `
      INSERT INTO matakuliah (nama, id_matakuliah, sks)
      VALUES (?, ?, ?)
    `;
    db.run(queryAddjurusan, [nama, id_matakuliah, sks], (err) => {
      if (err) {
        console.error("Error saat menambahkan jurusan: ", err.message);
        return callback(err);
      }
      callback(null);
    });
  }

  static deletematakuliah(id_matakuliah, callback) {
    const query = `
      DELETE FROM matakuliah WHERE id_matakuliah = ?
    `;
    db.run(query, [id_matakuliah], function (err) {
      if (err) {
        console.error(
          `Gagal menghapus jurusan dengan NIM ${id_matakuliah}:`,
          err.message
        );
        return callback(err, null);
      }
      if (this.changes === 0) {
        console.log(
          `Tidak ada matakuliah yang ditemukan dengan NIP ${id_matakuliah}.`
        );
        return callback(null, null);
      }
      console.log(`matakuliah dengan NIP ${id_matakuliah} berhasil dihapus.`);
      callback(null, true);
    });
  }
}
