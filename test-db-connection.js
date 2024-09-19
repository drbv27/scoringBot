const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  try {
    // Intenta realizar una operación simple
    const count = await prisma.tournament.count();
    console.log(`Conexión exitosa. Número de torneos: ${count}`);
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
