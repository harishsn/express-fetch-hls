var path = require('path');
var sqlite3 = require('sqlite3').verbose();

//insertEntry('249414131', 'http://localhost/storage/249414131/249414131.m3u8', 'https://player.vimeo.com/external/249414131.m3u8?s=10bf9d088fff85588fdd56dacd5f9f716c1c8dd5');
//getAllEntries();
//hasKey('249414132');

var getEntry = function (remote_url) {
    return new Promise(
        function (resolve, reject) {
          var db = new sqlite3.Database(path.join(process.cwd(), 'express-fetch-hls.db'));
          db.serialize(function() {
            db.all(`select * from recents where remote_url = '${remote_url}'`, function (err, rows) {
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
            resolve();
          });
        }
    );
};

var getAllEntries = new Promise(function(resolve, reject){
    var db = new sqlite3.Database(path.join(process.cwd(), 'express-fetch-hls.db'));
    db.serialize(function() {
      db.all(`select * from recents`, function (err, rows) {
        if(err){
            reject(err);
        }else{
            resolve(rows);
        }
      });
    });
});

module.exports = {
  getEntry,
  insertEntry,
  getAllEntries
}
