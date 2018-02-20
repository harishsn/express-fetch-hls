var express = require('express');
var router = express.Router();
var hlsfetcher = require('../vendor/hls-fetcher/src');
var validator = require('../utils/validator');
var filesystem = require('../utils/filesystem');
var db_manager = require('../utils/db_manager');
var sqlite3 = require('sqlite3').verbose();
var path = require('path');

/* GET stream. */
router.get('/', function(req, res, next) {

  // Validate for valid input url
  if(!validator.validateRemoteURL(req.query.hlsurl)){
        res.send({
            success : false,
            message : 'Enter valid remote url with extension .m3u8 or .m3u'
        });
    }

  // Get Download location from input url
  var path = filesystem.getStorableLocationDetails(req.query.hlsurl);
  db_manager.getEntry(req.query.hlsurl)
  .then(response => {
    // Check if entry already exists in database for input url and return computed url
    if(response.length > 0) {
      res.send({
              success : true,
              message : response[0].local_url
          });
    }else{

      // Fetch video components from url
      var options = {
        input: req.query.hlsurl,
        output: path.rel_dir,
        concurrency: 5,
        decrypt: false
      };

      hlsfetcher(options).then(function() {
        var local_url = `${req.protocol}://${req.hostname}/storage/${path.rel_file}`;
        // Insert into database
        db_manager.insertEntry(local_url, req.query.hlsurl)
        .then(()=>{
            res.send({
                success : true,
                message : local_url
            });
        })
      }).catch(function(error) {
        res.send({
              success : false,
              message : `Something went wrong`
            });
      });
    }
  })
  .catch(e => console.log(e));

});


/* GET recent fetches. */
router.get('/recent', function(req, res, next) {
  var db = new sqlite3.Database(path.join(process.cwd(), 'express-fetch-hls.db'));
  db.serialize(function() {
    db.all(`select * from recents`, function (err, rows) {
      if(err){
        res.send({
                success : false,
                message : `Something went wrong`
              });
      }else{
        res.send({
                success : true,
                message : rows
              });
      }
    });
  });
});

module.exports = router;
