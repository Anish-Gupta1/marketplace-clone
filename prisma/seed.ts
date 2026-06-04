import { prisma } from "../lib/prisma";

async function main() {
  await prisma.category.createMany({
    data: [
      { name: "Electronics" },
      { name: "Vehicles" },
      { name: "Furniture" },
      { name: "Services" },
      { name: "Real Estate" },
      { name: "Jobs" },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });