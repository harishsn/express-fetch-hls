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
    console.log(response);
    if(response.length > 0) {
      res.send({
              success : true,
              message : response[0].local_url
          });
    }else{
      var options = {
        input: req.query.hlsurl,
        output: path.rel_dir,
        concurrency: 5,
        decrypt: false
      };

      hlsfetcher(options).then(function() {
        var local_url = `${req.protocol}://${req.hostname}/storage/${path.rel_file}`;
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

router.get('/recent', function(req, res, next) {
  // db_manager.getAllEntries
  // .then(entries => {
  //   res.send({
  //         success : true,
  //         message : entries
  //       });
  // })
  // .catch(error => {
  //   res.send({
  //         success : false,
  //         message : `Something went wrong`
  //       });
  // });
  var db = new sqlite3.Database(path.join(process.cwd(), 'express-fetch-hls.db'));
  db.serialize(function() {
    db.all(`select * from recents`, function (err, rows) {
      if(err){
          //reject(err);
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
