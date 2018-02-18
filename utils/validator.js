
function validateRemoteURL(url){
    const regex = /(\w+)(\.\w+)+(?!.*(\w+)(\.\w+)+)/i;
    var res = regex.exec(url)[2];
    return res == `.m3u8` || res == `.m3u`;
}

module.exports = {
   validateRemoteURL
}
