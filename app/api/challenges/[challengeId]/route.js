import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  try {
    const { challengeId } = params;
    const body = await request.json();

    // Solo actualizamos los campos permitidos
    const updatedChallenge = await prisma.challenge.update({
      where: { id: challengeId },
      data: {
        name: body.name,
        description: body.description,
        type: body.type,
        rules: body.rules,
      },
    });

    return NextResponse.json(updatedChallenge);
  } catch (error) {
    console.error("Error updating challenge:", error);
    return NextResponse.json(
      { error: "Error updating challenge" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { challengeId } = params;

    await prisma.challenge.delete({
      where: { id: challengeId },
    });

    return NextResponse.json({ message: "Challenge deleted successfully" });
  } catch (error) {
    console.error("Error deleting challenge:", error);
    return NextResponse.json(
      { error: "Error deleting challenge" },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { challengeId } = params;

    // Obtener el reto original
    const originalChallenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!originalChallenge) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 }
      );
    }

    // Crear un nuevo reto con los mismos datos
    const newChallenge = await prisma.challenge.create({
      data: {
        name: `${originalChallenge.name} (Copia)`,
        description: originalChallenge.description,
        type: originalChallenge.type,
        rules: originalChallenge.rules,
        tournamentId: originalChallenge.tournamentId,
      },
    });

    return NextResponse.json(newChallenge, { status: 201 });
  } catch (error) {
    console.error("Error duplicating challenge:", error);
    return NextResponse.json(
      { error: "Error duplicating challenge" },
      { status: 500 }
    );
  }
}
