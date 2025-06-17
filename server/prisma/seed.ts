import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.task.deleteMany();
  console.log("🗑️ Cleared all existing tasks");

  // Seed new data with mandatory descriptions
  await prisma.task.createMany({
    data: [
      { 
        title: "Complete frontend", 
        description: "Finish React components for dashboard page",
        status: "pending" 
      },
      { 
        title: "Fix API bug", 
        description: "Investigate and resolve 500 error in POST /tasks endpoint",
        status: "completed"
      },
      { 
        title: "Write documentation", 
        description: "Create API documentation with Swagger",
        status: "pending" 
      },
    ],
  });

  console.log("🌱 Successfully seeded tasks with mandatory descriptions!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });