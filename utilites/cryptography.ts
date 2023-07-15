const bcrypt = require("bcrypt");

const IsPssCorrect = async (plantext: string, hashed: string) => {
  console.log("gtgtg");
  return await bcrypt.compare(plantext, hashed);
};

export { IsPssCorrect };
