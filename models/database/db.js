import sqlite3 from "sqlite3";

class Database {
  constructor(dbFile) {
    this.db = new sqlite3.Database(dbFile, (err) => {
      if (err) {
        console.error("Tidak bisa connect ke database", err);
      }
    });
  }
  getDbInstance() {
    return this.db;
  }
}
export const db = new Database("university.db").getDbInstance();
