import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const team = await prisma.team.findUnique({
      where: { id: params.teamId },
      include: { tournament: true },
    });
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
    return NextResponse.json(team);
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json({ error: "Error fetching team" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { teamId } = params;
    const body = await request.json();
    const { coach, participants, ...teamData } = body;

    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: {
        ...teamData,
        coach: {
          update: coach,
        },
        participants: {
          deleteMany: {},
          create: participants,
        },
      },
      include: {
        coach: true,
        participants: true,
      },
    });

    return NextResponse.json(updatedTeam);
  } catch (error) {
    console.error("Error updating team:", error);
    return NextResponse.json(
      { error: "Error updating team", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { teamId } = params;
    await prisma.team.delete({
      where: { id: teamId },
    });
    return NextResponse.json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error("Error deleting team:", error);
    return NextResponse.json(
      { error: "Error deleting team", details: error.message },
      { status: 500 }
    );
  }
}
