import { prisma } from "./lib/prisma";

async function main() {


const user = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@prisma.io",
      password: "12345",

      listings: {
        create: {
          title: "iPhone 14",
          description: "128GB, excellent condition",

          price: 50000,

          country: "India",
          state: "Maharashtra",
          city: "Mumbai",
          area: "Andheri",

          imageUrl: "https://example.com/iphone.jpg",

          category: {
            create: {
              name: "Electronics",

              subCategories: {
                create: {
                  name: "Mobiles",
                },
              },
            },
          },

          subCategory: {
            create: {
              name: "Smartphones",

              category: {
                create: {
                  name: "Electronics 2",
                },
              },
            },
          },
        },
      },
    },
    include: {
      listings: true,
    },
  });
  console.log("Created user:", user);

  // Fetch all users with their posts
  const allUsers = await prisma.user.findMany();

  console.log("All users:", JSON.stringify(allUsers, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });