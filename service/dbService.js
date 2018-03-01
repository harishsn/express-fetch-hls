var path = require('path');
var sqlite3 = require('sqlite3').verbose();

var getEntry = function (remote_url) {
    return new Promise(
        function (resolve, reject) {
          var db = new sqlite3.Database(path.join(process.cwd(), 'express-fetch-hls.db'));
          db.serialize(function() {
            db.all(`select * from recents where remote_url = '${remote_url}'`, function (err, rows) {
              db.close();
              if(err){
                  reject(err);
              }else{
                  resolve(rows);
              }
            });
          });
        }
    );
};

var insertEntry = function (local_url, remote_url) {
    return new Promise(
        function (resolve, reject) {
          var db = new sqlite3.Database(path.join(process.cwd(), 'express-fetch-hls.db'));
          db.serialize(function() {
            var rcnt = db.prepare("INSERT INTO recents(local_url, remote_url) VALUES (?, ?)");
            rcnt.run(local_url.toString(), remote_url.toString());
            rcnt.finalize();
            db.close();
            resolve();
          });
        }
    );
};

var getAllEntries = function () {
    return new Promise(function(resolve, reject){
      var db = new sqlite3.Database(path.join(process.cwd(), 'express-fetch-hls.db'));
      db.serialize(function() {
        db.all(`select * from recents`, function (err, rows) {
          db.close();
          if(err){
            reject(err);
          }else{
            resolve(rows);
          }
        });
      });
    });
}

module.exports = {
  getEntry,
  insertEntry,
  getAllEntries
}
