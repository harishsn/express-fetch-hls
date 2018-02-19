
function validateRemoteURL(url){
  try {
    const regex = /(\w+)(\.\w+)+(?!.*(\w+)(\.\w+)+)/i;
    var res = regex.exec(url)[2];
    return res == `.m3u8` || res == `.m3u`;
  } catch (error) {
    return false;
  }
}

module.exports = {
   validateRemoteURL
}
