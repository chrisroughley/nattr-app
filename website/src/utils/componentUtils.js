export const generateId = () => {
  let generatedId = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 20; i++) {
    generatedId += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return generatedId;
};
