import jsSHA from 'jssha';

const SALT = 'hello';

// Fn that converts a variable into a hashed string
export function getHashedString(stringToHash) {
  const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
  shaObj.update(stringToHash);
  const hashedString = shaObj.getHash('HEX');
  return hashedString;
}

// Fn that converts supplied userId into a hash (using a salt)
export function convertUserIdToHash(userId) {
  const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
  const unhashedCookieString = `${userId}-${SALT}`;
  shaObj.update(unhashedCookieString);
  const hashedCookieString = shaObj.getHash('HEX');
  return hashedCookieString;
}
