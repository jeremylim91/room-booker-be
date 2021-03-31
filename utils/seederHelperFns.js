module.exports = {
  getRandomDateInRange(start, end) {
    const randomDateInRange = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomDateInRange;
  },
  getRandomNumInRange(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  },
  removeSpacesInString(word) {
    return word.replace(/\s/g, '');
  },
};
