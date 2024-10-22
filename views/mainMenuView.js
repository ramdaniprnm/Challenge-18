const mainMenuView = {
  optionMainMenu: () => {
    console.log("\n===================== MAIN MENU =====================");
    console.log("[1]. Mahasiswa");
    console.log("[2]. Jurusan");
    console.log("[3]. Dosen");
    console.log("[4]. Matakuliah");
    console.log("[5]. Kontrak");
    console.log("[6]. Logout");
  },
  question: () => {
    return `Masukkan salah satu nomor opsi di atas: `;
  },
  exit: () => {
    console.log("Sign Out!");
  },
};
