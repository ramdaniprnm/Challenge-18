import Table from "cli-table";

export const DosenView = {
  optionMenuDosen: () => {
    console.log(`\n===================== *JURUSAN MENU* =====================`);
    console.log(`Silahkan pilih Opsi di bawah ini`);
    console.log("[1]. Daftar Dosen");
    console.log("[2]. Cari Dosen");
    console.log("[3]. Tambah Dosen");
    console.log("[4]. Hapus Dosen");
    console.log("[5]. kembali");
    console.log(`============================================================`);
  },
  question: () => {
    return `Masukkan nomor dari opsi di atas: `;
  },
  rowDosen: (rows) => {
    const table = new Table({
      head: ["Kode dosen", "Nama dosen"],
      colWidths: [20, 20],
    });
    rows.forEach((row) => {
      table.push([row.nip, row.nama]);
    });
    console.log(table.toString());
  },
  listAddDosen: (rows) => {
    const table = new Table({
      head: ["Kode dosen", "Nama dosen"],
      colWidths: [10, 20],
    });
    rows.forEach((row) => {
      table.push([row.nip, row.nama]);
    });
    console.log(table.toString());
  },
  dosenDetail: (ID) => {
    console.log("\n=============================================");
    console.log(`NIP dosen : ${ID.nip}`);
    console.log(`Nama dosen : ${ID.nama}`);
    console.log("=============================================");
  },
  dosenAdded: (nip) => {
    console.log(`dosen dengan NIP: '${nip}' Berhasil Ditambahkan`);
  },
  dosenDeleted: (nip) => {
    console.log(`dosen dengan NIP: '${nip}' Berhasil Di Hapus`);
  },
  dosenNotFound: (nip) => {
    console.log(`dosen dengan NIP: '${nip}' Not Found!`);
  },
  dosenExist: (nip) => {
    console.log(`Dosen dengan ID '${nip}' sudah ada`);
  },
  invalidInput: () => {
    console.log("Input Salah!");
  },
};
