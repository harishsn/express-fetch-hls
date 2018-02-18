var path = require('path');

const storage = path.join(process.cwd(), 'public/storage/');
const reg = /(\w+)(\.\w+)+(?!.*(\w+)(\.\w+)+)/i;

function getFileName(url){
  return reg.exec(url)[0];
}

function getDirectory(url){
  return reg.exec(url)[1];
}

function getStorableLocationDetails(url){
    return {
      rel_dir : `${storage}${getDirectory(url)}`,
      rel_file : `${getDirectory(url)}/${getFileName(url)}`,
    };
}

module.exports = {
  getStorableLocationDetails
};
