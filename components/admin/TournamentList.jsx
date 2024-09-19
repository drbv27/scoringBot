"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useTournamentStore from "@/store/tournamentStore";
import EditTournamentForm from "./EditTournamentForm";
import AddChallengeForm from "./AddChallengeForm";
import Link from "next/link";

export default function TournamentList() {
  const { tournaments, isLoading, error, fetchTournaments, deleteTournament } =
    useTournamentStore();
  const [editingTournament, setEditingTournament] = useState(null);
  const [addingChallengeTo, setAddingChallengeTo] = useState(null);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este torneo?")) {
      try {
        await deleteTournament(id);
      } catch (error) {
        console.error("Error al eliminar el torneo:", error);
      }
    }
  };

  const handleChallengeAdded = (newChallenge) => {
    fetchTournaments();
    setAddingChallengeTo(null);
  };

  if (isLoading) return <div>Cargando torneos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      {tournaments.map((tournament) => (
        <Card key={tournament.id}>
          <CardHeader>
            <CardTitle>{tournament.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Fecha de inicio:{" "}
              {new Date(tournament.startDate).toLocaleDateString()}
            </p>
            <p>
              Fecha de fin: {new Date(tournament.endDate).toLocaleDateString()}
            </p>
            <p>Estado: {tournament.status}</p>
            <p>Retos: {tournament.challenges.length}</p>
            <div className="mt-4 space-x-2">
              <Button onClick={() => setEditingTournament(tournament)}>
                Editar
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(tournament.id)}
              >
                Eliminar
              </Button>
              <Button onClick={() => setAddingChallengeTo(tournament.id)}>
                Añadir Reto
              </Button>
              <Link href={`/admin/tournaments/${tournament.id}`}>
                <Button variant="outline">Ver Detalles</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
      {editingTournament && (
        <EditTournamentForm
          tournament={editingTournament}
          onClose={() => setEditingTournament(null)}
        />
      )}
      {addingChallengeTo && (
        <AddChallengeForm
          tournamentId={addingChallengeTo}
          onChallengeAdded={handleChallengeAdded}
        />
      )}
    </div>
  );
}
