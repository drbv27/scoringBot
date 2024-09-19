import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tournamentId = searchParams.get("tournamentId");

  try {
    const teams = await prisma.team.findMany({
      where: tournamentId ? { tournamentId } : {},
      include: {
        coach: true,
        participants: true,
        tournament: true,
      },
    });
    return NextResponse.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Error fetching teams" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { coach, participants, tournamentId, ...teamData } = body;

    // Asegurarse de que las fechas estén en el formato correcto
    const formattedParticipants = participants.map((participant) => ({
      ...participant,
      dateOfBirth: new Date(participant.dateOfBirth),
    }));

    const team = await prisma.team.create({
      data: {
        ...teamData,
        tournament: {
          connect: { id: tournamentId },
        },
        coach: {
          create: coach,
        },
        participants: {
          create: formattedParticipants,
        },
      },
      include: {
        coach: true,
        participants: true,
        tournament: true,
      },
    });

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      {
        error: "Error creating team",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
