import Table from "cli-table";

export const jurusanView = {
  optionMenuJurusan: () => {
    console.log(`\n===================== *JURUSAN MENU* =====================`);
    console.log(`Silahkan pilih Opsi di bawah ini`);
    console.log("[1]. Daftar Jurusan");
    console.log("[2]. Cari jurusan");
    console.log("[3]. Tambah jurusan");
    console.log("[4]. Hapus jurusan");
    console.log("[5]. kembali");
    console.log(`============================================================`);
  },
  question: () => {
    return `Masukkan nomor dari opsi di atas: `;
  },
  rowJurusan: (rows) => {
    const table = new Table({
      head: ["Kode Jurusan", "Nama Jurusan"],
      colWidths: [20, 20],
    });
    rows.forEach((row) => {
      table.push([row.id_jurusan, row.nama_jurusan]);
    });
    console.log(table.toString());
  },
  listAddJurusan: (rows) => {
    const table = new Table({
      head: ["Kode Jurusan", "Nama Jurusan"],
      colWidths: [10, 20],
    });
    rows.forEach((row) => {
      table.push([row.id_jurusan, row.nama_jurusan]);
    });
    console.log(table.toString());
  },
  jurusanDetail: (ID) => {
    console.log("\n=============================================");
    console.log(`Kode Jurusan : ${ID.id_jurusan}`);
    console.log(`Nama Jurusan : ${ID.nama_jurusan}`);
    console.log("=============================================");
  },
  jurusanAdded: (id) => {
    console.log(`jurusan dengan ID: '${id}' Berhasil Ditambahkan`);
  },
  jurusanDeleted: (id) => {
    console.log(`jurusan dengan ID: '${id}' Berhasil Di Hapus`);
  },
  jurusanNotFound: (id) => {
    console.log(`jurusan dengan ID: '${id}' Not Found!`);
  },
  invalidInput: () => {
    console.log("Input Salah!");
  },
};
