const validatePartsRequest = ({ data, partsArr }) => {
  const existParts = [];

  data.forEach((item) => {
    item.parts.forEach((part) => {
      existParts.push(part.partNumber);
    });
  });

  return existParts.every((item) => !partsArr.includes(item));
};

module.exports = { validatePartsRequest };
