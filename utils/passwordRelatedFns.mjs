import jsSHA from 'jssha';

export default function getHashedString(stringToHash) {
  const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
  shaObj.update(stringToHash);
  const hashedString = shaObj.getHash('HEX');
  return hashedString;
}
