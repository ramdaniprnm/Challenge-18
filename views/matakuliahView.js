import Table from "cli-table";

export const matakuliahView = {
  optionMenuMatakuliah: () => {
    console.log(`\n===================== *JURUSAN MENU* =====================`);
    console.log(`Silahkan pilih Opsi di bawah ini`);
    console.log("[1]. Daftar Matakuliah");
    console.log("[2]. Cari Matakuliah");
    console.log("[3]. Tambah Matakuliah");
    console.log("[4]. Hapus Matakuliah");
    console.log("[5]. kembali");
    console.log(`============================================================`);
  },
  question: () => {
    return `Masukkan nomor dari opsi di atas: `;
  },
  rowMatakuliah: (rows) => {
    const table = new Table({
      head: ["Kode Matakuliah", "Nama Matakuliah", "SKS"],
      colWidths: [20, 20, 10],
    });
    rows.forEach((row) => {
      table.push([row.id_matakuliah, row.nama, row.sks]);
    });
    console.log(table.toString());
  },
  listAddMatakuliah: (rows) => {
    const table = new Table({
      head: ["Kode Matakuliah", "Nama Matakuliah"],
      colWidths: [10, 20],
    });
    rows.forEach((row) => {
      table.push([row.nip, row.nama, row.sks]);
    });
    console.log(table.toString());
  },
  MatakuliahDetail: (ID) => {
    console.log("\n=============================================");
    console.log(`ID Matakuliah : ${ID.id_matakuliah}`);
    console.log(`Nama Matakuliah : ${ID.nama}`);
    console.log(`SKS Matakuliah : ${ID.sks}`);
    console.log("=============================================");
  },
  MatakuliahAdded: (nip) => {
    console.log(`Matakuliah dengan ID: '${nip}' Berhasil Ditambahkan`);
  },
  MatakuliahDeleted: (nip) => {
    console.log(`Matakuliah dengan ID: '${nip}' Berhasil Di Hapus`);
  },
  MatakuliahNotFound: (nip) => {
    console.log(`Matakuliah dengan ID: '${nip}' Not Found!`);
  },
  MatakuliahExist: (nip) => {
    console.log(`Matakuliah dengan ID '${nip}' sudah ada`);
  },
  invalidInput: () => {
    console.log("Input Salah!");
  },
};
