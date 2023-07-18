const bcrypt = require("bcrypt");

const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const CatchAysnc = require("./CatchAysnc");
prisma.$use(async (params: any, next: any) => {
  if (params.model === "User") {
    if (params.args) {
      const { data } = params.args;

      if (params.action === "create" || params.action === "update") {
        if (data.password) {
          const HashedPassword = await bcrypt.hash(data.password, 14);

          data.password = HashedPassword;
        }
        if (data.newpassword) {
          const HashedPassword = await bcrypt.hash(data.newpassword, 14);

          data.newpassword = HashedPassword;
        }
      }
    }
  }
  return next(params);
});
export { prisma };
