import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request, { params }) {
  try {
    const { tournamentId } = params;
    const body = await request.json();

    const challenge = await prisma.challenge.create({
      data: {
        name: body.name,
        description: body.description,
        type: body.type,
        rules: body.rules, // Prisma manejará la conversión a JSON
        tournamentId: tournamentId,
      },
    });

    return NextResponse.json(challenge, { status: 201 });
  } catch (error) {
    console.error("Error creating challenge:", error);
    return NextResponse.json(
      { error: "Error creating challenge" },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const { tournamentId } = params;
    const challenges = await prisma.challenge.findMany({
      where: { tournamentId: tournamentId },
    });
    return NextResponse.json(challenges);
  } catch (error) {
    console.error("Error fetching challenges:", error);
    return NextResponse.json(
      { error: "Error fetching challenges" },
      { status: 500 }
    );
  }
}
