export const generateId = () => {
  let idQuadrant = () => {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16);
  };
  let lowerCaseId = idQuadrant() + idQuadrant() + idQuadrant() + idQuadrant();
  let randomlyCapitalizedId = "";
  for (let i = 0; i < lowerCaseId.length; i++) {
    if (Math.round(Math.random())) {
      randomlyCapitalizedId += lowerCaseId[i].toUpperCase();
    } else {
      randomlyCapitalizedId += lowerCaseId[i];
    }
  }
  return randomlyCapitalizedId;
};
