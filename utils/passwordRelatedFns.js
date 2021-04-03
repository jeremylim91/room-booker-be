const jsSHA = require('jssha');

module.exports = {
  getHashedString(stringToHash) {
    const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
    shaObj.update(stringToHash);
    const hashedString = shaObj.getHash('HEX');
    return hashedString;
  },
};
