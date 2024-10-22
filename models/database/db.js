import sqlite3 from "sqlite3";

class Database {
  constructor(dbFilePath) {
    this.db = new sqlite3.Database(dbFilePath, (err) => {
      if (err) {
        console.error("Could not connect to database", err);
      }
    });
  }

  getDbInstance() {
    return this.db;
  }
}

export const db = new Database("university.db").getDbInstance();
