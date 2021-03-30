const getRandomNumInRange = (min, max) => Math.random() * (max - min) + min;

const getRandomDateInRange = (start, end) => {
  const randomDateInRange = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return getRandomDateInRange;
};

export {
  getRandomNumInRange, getRandomDateInRange,
};
