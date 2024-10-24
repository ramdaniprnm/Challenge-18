import Table from "cli-table";

export const KontrakView = {
  optionMenukontrak: () => {
    console.log(`\n===================== *KONTRAK MENU* =====================`);
    console.log(`Silahkan pilih Opsi di bawah ini`);
    console.log("[1]. Daftar kontrak");
    console.log("[2]. Cari kontrak");
    console.log("[3]. Tambah kontrak");
    console.log("[4]. Hapus kontrak");
    console.log("[5]. Update Nilai");
    console.log("[6]. kembali");
    console.log(`============================================================`);
  },
  question: () => {
    return `Masukkan nomor dari opsi di atas: `;
  },
  rowKontrak: (rows) => {
    const table = new Table({
      head: ["ID", "NIM", "Nama", "Mata Kuliah", "Dosen", "Nilai"],
      colWidths: [10, 15, 30, 15, 20, 10],
    });
    rows.forEach((row) => {
      table.push([
        row.id,
        row.nim,
        row.nama,
        row.nama_matkul,
        row.nama_dosen,
        row.nilai ? row.nilai : "",
      ]);
    });
    console.log(table.toString());
  },
  listSearchKontrak: (rows) => {
    const table = new Table({
      head: ["ID", "NIM", "Mata Matakuliah", "NIP", "Nilai"],
      colWidths: [10, 20, 15, 15, 10],
    });
    rows.forEach((row) => {
      table.push([
        row.id,
        row.nim,
        row.nama_matakuliah,
        row.nip,
        row.nilai != null ? row.nilai : "",
      ]);
    });
    console.log(table.toString());
  },

  kontrakAdded: (ID) => {
    console.log(`kontrak dengan ID: '${ID}' Berhasil Ditambahkan`);
  },
  kontrakDeleted: (ID) => {
    console.log(`kontrak dengan ID: '${ID}' Berhasil Di Hapus`);
  },
  kontrakNotFound: (ID) => {
    console.log(`kontrak dengan ID: '${ID}' Not Found!`);
  },
  kontrakExist: (ID) => {
    console.log(`kontrak dengan ID: '${ID}' sudah Ada`);
  },
  invalidInput: () => {
    console.log("Input Salah!");
  },
};
