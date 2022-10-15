const getShortUrl = (numsFromDB) => {
  const allNums = numsFromDB;
  const newNum = Math.floor(1000 + Math.random() * 9000);
  if (allNums.includes(newNum) == false) {
    allNums.push(newNum);
    return newNum;
  } else if (allNums.includes(newNum)) {
    getShortUrl();
  }
};

module.exports = getShortUrl;
