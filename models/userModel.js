import sqlite3 from "sqlite3";

export class userModel {
  static login(username, callback) {
    const db = new sqlite3.Database("university.db", (err) => {
      if (err) throw err;
      db.get(
        "SELECT * FROM user WHERE username = ?",
        [username],
        (err, user) => {
          if (err) throw err;
          callback(user);
        }
      );
    });
  }
}
