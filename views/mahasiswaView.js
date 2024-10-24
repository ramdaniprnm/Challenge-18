import Table from "cli-table";

export const mahasiswaView = {
  optionMenuMahasiswa: () => {
    console.log(
      `\n===================== *MAHASISWA MENU* =====================`
    );
    console.log(`Silahkan pilih Opsi di bawah ini`);
    console.log("[1]. Daftar Mahasiswa");
    console.log("[2]. Cari Mahasiswa");
    console.log("[3]. Tambah Mahasiswa");
    console.log("[4]. Hapus Mahasiswa");
    console.log("[5]. kembali");
    console.log(`============================================================`);
  },
  question: () => {
    return `Masukkan nomor dari opsi di atas: `;
  },
  rowMahasiswa: (rows) => {
    const table = new Table({
      head: ["NIM", "Nama", "Tanggal Lahir", "Alamat", "Nama Jurusan"],
      colWidths: [10, 30, 20, 30, 20],
    });
    rows.forEach((row) => {
      table.push([
        row.nim,
        row.nama,
        row.tgl_lahir,
        row.alamat,
        row.nama_jurusan,
      ]);
    });
    console.log(table.toString());
  },
  listAddMahasiswa: (rows) => {
    const table = new Table({
      head: [
        "NIM",
        "Nama",
        "Tanggal Lahir",
        "Alamat",
        "Kode Jurusan",
        "Nama Jurusan",
      ],
      colWidths: [10, 30, 20, 30, 30, 20],
    });
    rows.forEach((row) => {
      table.push([
        row.nim,
        row.nama,
        row.tgl_lahir,
        row.alamat,
        row.id_jurusan,
        row.nama_jurusan,
      ]);
    });
    console.log(table.toString());
  },
  mahasiswaDetail: (id) => {
    console.log("\n=============================================");
    console.log(`NIM          : ${id.nim}`);
    console.log(`Nama         : ${id.nama}`);
    console.log(`Tanggal Lahir: ${id.tgl_lahir}`);
    console.log(`Alamat       : ${id.alamat}`);
    console.log(`Nama Jurusan : ${id.nama_jurusan}`);
    console.log("=============================================");
  },
  mahasiswaAdded: (nim) => {
    console.log(`Mahasiswa dengan NIM: '${nim}' Berhasil Ditambahkan`);
  },
  mahasiswaDeleted: (nim) => {
    console.log(`Mahasiswa dengan NIM: '${nim}' Berhasil Di Hapus`);
  },
  mahasiswaNotFound: (nim) => {
    console.log(`Mahasiswa dengan NIM: '${nim}' Not Found!`);
  },
  mahasiswaExist: (nim) => {
    console.log(`Mahasiswa dengan NIM: '${nim}' sudah Ada`);
  },
  invalidInput: () => {
    console.log("Input Salah!");
  },
};
