import { db } from "./database/db.js";

export class KontrakModel {
  static listKontrak(callback) {
    const query = `
      SELECT assignment.id, assignment.nim, mahasiswa.nama, matakuliah.nama AS nama_matkul, dosen.nama AS nama_dosen, assignment.nilai
      FROM assignment 
      LEFT JOIN mahasiswa ON assignment.nim = mahasiswa.nim
      LEFT JOIN matakuliah ON assignment.id_matakuliah = matakuliah.id_matakuliah
      LEFT JOIN dosen ON assignment.nip = dosen.nip
    `;
    db.all(query, (err, rows) => {
      if (err) {
        console.error("Error saat mengambil data kontrak: ", err.message);
        return callback(err, null);
      }
      callback(null, rows);
    });
  }
  static searchKontrak(nim, callback) {
    const query = `
      SELECT a.id, a.nim, mk.nama AS nama_matakuliah, a.nilai, a.nip
      FROM assignment a
      JOIN matakuliah mk ON a.id_matakuliah = mk.id_matakuliah
      WHERE a.nim = ?
    `;
    db.all(query, [nim], (err, rows) => {
      if (err) {
        console.error("Error fetching contract data by NIM:", err.message);
        return callback(err, null);
      }
      callback(null, rows);
    });
  }
  static addKontrak(nim, nama, tgl_lahir, alamat, id_jurusan, callback) {
    const queryAddKontrak = `
    INSERT INTO mahasiswa (nim, nama, tgl_lahir, alamat, id_jurusan)
    VALUES (?, ?, ?, ?, ?)
    `;
    db.run(
      queryAddKontrak,
      [nim, nama, tgl_lahir, alamat, id_jurusan],
      (err) => {
        if (err) {
          console.error("Error saat menambahkan kontrak: ", err.message);
          return callback(err);
        }
        callback(null);
      }
    );
  }

  static updateNilaiKontrak(id, nilai, callback) {
    const queryUpdateNilai = `
    UPDATE assignment
    SET nilai = ?
    WHERE id = ?
  `;
    db.run(queryUpdateNilai, [nilai, id], (err) => {
      if (err) {
        console.error("Error saat mengupdate nilai kontrak: ", err.message);
        return callback(err);
      }
      console.log(`Nilai kontrak dengan ID ${id} berhasil diupdate.`);
      callback(null);
    });
  }
}
//   static deleteKontrak(id, callback) {
//     const query = `
//       DELETE FROM assignment WHERE id = ?
//     `;
//     db.run(query, [id], function (err) {
//       if (err) {
//         console.error(`Gagal menghapus kontrak dengan ID ${id}:`, err.message);
//         return callback(err, null);
//       }
//       if (this.changes === 0) {
//         console.log(`Tidak ada kontrak yang ditemukan dengan ID ${id}.`);
//         return callback(null, null);
//       }
//       console.log(`Kontrak dengan ID ${id} berhasil dihapus.`);
//       callback(null, true);
//     });
//   }
