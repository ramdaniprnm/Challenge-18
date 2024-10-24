import { db } from "./database/db.js";

export class mahasiswaModel {
  static listStudent(callback) {
    const query = `
      SELECT m.nim, m.nama, m.tgl_lahir, m.alamat, j.id_jurusan, j.nama_jurusan
      FROM mahasiswa m
      JOIN jurusan j ON m.id_jurusan = j.id_jurusan
    `;
    db.all(query, (err, rows) => {
      if (err) {
        console.error("Error mahasiswa tidak terdeteksi: ", err.message);
        return callback(err, null);
      }
      callback(null, rows);
    });
  }

  static searchStudent(nim, callback) {
    const query = `
    SELECT m.nim, m.nama, m.tgl_lahir, m.alamat, m.id_jurusan, j.nama_jurusan
      FROM mahasiswa m
      JOIN jurusan j ON m.id_jurusan = j.id_jurusan
      WHERE m.nim = ?`;
    db.get(query, [nim], (err, row) => {
      if (err) {
        console.error("Error searching mahasiswa: ", err.message);
        return callback(err, null);
      }
      callback(null, row);
    });
  }
  static addMahasiswa(nim, nama, tgl_lahir, alamat, id_jurusan, callback) {
    const queryAddMahasiswa = `
      INSERT INTO mahasiswa (nim, nama, tgl_lahir, alamat, id_jurusan)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.run(
      queryAddMahasiswa,
      [nim, nama, tgl_lahir, alamat, id_jurusan],
      (err) => {
        if (err) {
          console.error("Error saat menambahkan mahasiswa: ", err.message);
          return callback(err);
        }
        callback(null);
      }
    );
  }

  static deleteMahasiswa(nim, callback) {
    const query = `
      DELETE FROM mahasiswa WHERE nim = ?
    `;
    db.run(query, [nim], function (err) {
      if (err) {
        console.error(
          `Gagal menghapus mahasiswa dengan NIM ${nim}:`,
          err.message
        );
        return callback(err, null);
      }
      if (this.changes === 0) {
        console.log(`Tidak ada mahasiswa yang ditemukan dengan NIM ${nim}.`);
        return callback(null, null);
      }
      console.log(`Mahasiswa dengan NIM ${nim} berhasil dihapus.`);
      callback(null, true);
    });
  }
}
