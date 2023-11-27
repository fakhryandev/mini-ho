const convertToDate = (dateString, time) => {
  const [day, month, year] = dateString.split("-");

  return new Date(`${year}-${month}-${day}${time}`);
};

module.exports = {
  convertToDate,
};
