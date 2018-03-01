var path = require('path');
var url = require('url');

const storage = path.join(process.cwd(), 'public/storage/');
const reg = /(\w+)(\.\w+)+(?!.*(\w+)(\.\w+)+)/i;

function getFileName(l_url){
  return reg.exec(l_url)[0];
}

function getDirectory(l_url){
  var q = url.parse(l_url, true);
  return `${q.hostname}/${reg.exec(l_url)[1]}`;
}

function getStorableLocationDetails(l_url){
    return {
      rel_dir : `${storage}${getDirectory(l_url)}`,
      rel_file : `${getDirectory(l_url)}/${getFileName(l_url)}`,
    };
}

module.exports = {
  getStorableLocationDetails,
  getDirectory
};
