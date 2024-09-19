import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { tournamentId } = params;
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        challenges: true,
      },
    });

    if (!tournament) {
      return NextResponse.json(
        { error: "Tournament not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(tournament);
  } catch (error) {
    console.error("Error fetching tournament details:", error);
    return NextResponse.json(
      { error: "Error fetching tournament details" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { tournamentId } = params;
    const body = await request.json();
    const updatedTournament = await prisma.tournament.update({
      where: { id: tournamentId },
      data: {
        name: body.name,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        status: body.status,
      },
    });
    return NextResponse.json(updatedTournament);
  } catch (error) {
    console.error("Error updating tournament:", error);
    return NextResponse.json(
      { error: "Error updating tournament" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { tournamentId } = params;
    await prisma.tournament.delete({
      where: { id: tournamentId },
    });
    return NextResponse.json({ message: "Tournament deleted successfully" });
  } catch (error) {
    console.error("Error deleting tournament:", error);
    return NextResponse.json(
      { error: "Error deleting tournament" },
      { status: 500 }
    );
  }
}
