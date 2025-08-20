// Script buat masukin data awal ke DB

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const prisma = new PrismaClient();

(async () => {
  const hashed = await bcrypt.hash("password", 10);
  await prisma.user.upsert({
    where: { email: "john@gmail.com" },
    update: {},
    create: { email: "john@gmail.com", password: hashed, name: "John Doe" },
  });
  console.log("Seeded: john@gmail.com / password");
  await prisma.$disconnect();
})();
