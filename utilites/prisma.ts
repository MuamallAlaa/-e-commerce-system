const bcrypt = require("bcrypt");

const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const CatchAysnc = require("./CatchAysnc");
prisma.$use(async (params: any, next: any) => {
  if (params.model === "User") {
    const { data } = params.args;
    console.log("rfrf", data);

    if (params.action === "create") {
      if (data.password) {
        const HashedPassword = await bcrypt.hash(data.password, 14);

        data.password = HashedPassword;
      }
    }
  }

  return next(params);
});
export { prisma };
