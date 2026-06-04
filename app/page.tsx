import { prisma } from "@/lib/prisma";

export default async function Home() {
  const users = await prisma.user.findMany();

  return (
    <div>
      Database Connected ✅
      <br />
      Users: {users.length}
    </div>
  );
}