/**
 * Seed script for algo-practice.
 *
 * Run after migration:
 *   node prisma/seed.js
 */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@algo.app" },
    update: {},
    create: {
      email: "demo@algo.app",
      name: "Demo User",
      password: passwordHash
    }
  });

  await prisma.task.upsert({
    where: { id: "demo-task-1" },
    update: {},
    create: {
      id: "demo-task-1",
      title: "Two Sum",
      description: "Solve the Two Sum problem and return indices of the two numbers.",
      difficulty: "Easy",
      userId: user.id
    }
  });

  await prisma.task.upsert({
    where: { id: "demo-task-2" },
    update: {},
    create: {
      id: "demo-task-2",
      title: "Merge Intervals",
      description: "Given a collection of intervals, merge all overlapping intervals.",
      difficulty: "Medium",
      userId: user.id
    }
  });

  console.log("Seed finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
