import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL!;
  const username = process.env.ADMIN_USERNAME!;
  const plainPassword = process.env.ADMIN_PASSWORD!;

  // Validate required environment variables
  if (!email || !username || !plainPassword) {
    throw new Error(
      "Missing required environment variables: ADMIN_EMAIL, ADMIN_USERNAME, or ADMIN_PASSWORD."
    );
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(plainPassword, salt);

  // Upsert admin user
  const admin = await prisma.auth.upsert({
    where: { username },
    update: {}, // Update fields here if needed
    create: {
      username,
      password,
      email,
    },
  });

  console.log("Seeded admin user:", admin);
}

// Execute the seeding process
main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error("Error seeding database:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
