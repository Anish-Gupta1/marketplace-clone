import { prisma } from "../lib/prisma";

const categories = [
  {
    name: "Electronics",
    subs: [
      "Mobiles",
      "Laptops",
      "Tablets",
      "Televisions",
      "Gaming Consoles",
      "Cameras",
      "Smart Watches",
      "Headphones",
      "Speakers",
      "Printers",
      "Monitors",
      "Computer Accessories",
      "Networking Devices",
    ],
  },

  {
    name: "Vehicles",
    subs: [
      "Cars",
      "Bikes",
      "Scooters",
      "Bicycles",
      "Commercial Vehicles",
      "Auto Parts",
      "Spare Parts",
      "Accessories",
    ],
  },

  {
    name: "Furniture",
    subs: [
      "Beds",
      "Sofas",
      "Chairs",
      "Tables",
      "Wardrobes",
      "Dining Sets",
      "Office Furniture",
      "Mattresses",
      "Bookshelves",
      "TV Units",
    ],
  },

  {
    name: "Services",
    subs: [
      "Plumbing",
      "Electrician",
      "Cleaning",
      "Painting",
      "Moving Services",
      "Repair Services",
      "Home Maintenance",
      "Beauty Services",
      "Photography",
      "Event Management",
      "Tutoring",
      "Fitness Training",
    ],
  },

  {
    name: "Real Estate",
    subs: [
      "Apartments",
      "Houses",
      "Villas",
      "PG & Hostel",
      "Office Space",
      "Commercial Property",
      "Shops",
      "Land",
      "Plots",
      "Warehouse",
    ],
  },

  {
    name: "Jobs",
    subs: [
      "Software Development",
      "Data Science",
      "Marketing",
      "Sales",
      "Customer Support",
      "Finance",
      "HR",
      "Operations",
      "Design",
      "Content Writing",
      "Teaching",
      "Part Time Jobs",
      "Internships",
    ],
  },
];

async function main() {
  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: {
        name: categoryData.name,
      },
      update: {},
      create: {
        name: categoryData.name,
      },
    });

    for (const subName of categoryData.subs) {
      const existing =
        await prisma.subCategory.findFirst({
          where: {
            name: subName,
            categoryId: category.id,
          },
        });

      if (!existing) {
        await prisma.subCategory.create({
          data: {
            name: subName,
            categoryId: category.id,
          },
        });
      }
    }
  }

  console.log("✅ Marketplace seeded");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });