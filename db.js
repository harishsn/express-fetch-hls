var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('express-fetch-hls.db');

db.serialize(function() {
  db.run("CREATE TABLE if not exists recents(id integer primary key asc, local_url text, remote_url text)");
});

db.close();
