"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import EditChallengeForm from "@/components/admin/EditChallengeForm";
import ChallengeRulesDisplay from "@/components/admin/ChallengeRulesDisplay";
import TeamList from "@/components/admin/TeamList";
import TeamForm from "@/components/admin/TeamForm";

export default function TournamentDetailsPage() {
  const { tournamentId } = useParams();
  const [tournament, setTournament] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [showAddTeamForm, setShowAddTeamForm] = useState(false);

  const fetchTournament = async () => {
    try {
      const response = await axios.get(`/api/tournaments/${tournamentId}`);
      setTournament(response.data);
    } catch (error) {
      console.error("Error fetching tournament details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTournament();
  }, [tournamentId]);

  const handleDeleteChallenge = async (challengeId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este reto?")) {
      try {
        await axios.delete(`/api/challenges/${challengeId}`);
        fetchTournament(); // Recargar los datos del torneo
      } catch (error) {
        console.error("Error deleting challenge:", error);
        alert("Error al eliminar el reto");
      }
    }
  };

  const handleChallengeUpdated = () => {
    fetchTournament(); // Recargar los datos del torneo
  };

  const handleDuplicateChallenge = async (challengeId) => {
    try {
      await axios.post(`/api/challenges/${challengeId}`);
      fetchTournament(); // Recargar los datos del torneo
    } catch (error) {
      console.error("Error duplicating challenge:", error);
      alert("Error al duplicar el reto");
    }
  };

  const handleTeamAdded = () => {
    setShowAddTeamForm(false);
    fetchTournament(); // Recargar los datos del torneo, incluyendo la lista actualizada de equipos
  };

  if (isLoading) return <div>Cargando detalles del torneo...</div>;
  if (!tournament) return <div>Torneo no encontrado</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{tournament.name}</h1>
      <Card>
        <CardHeader>
          <CardTitle>Detalles del Torneo</CardTitle>
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
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mt-6 mb-4">Retos</h2>
      {tournament.challenges.map((challenge) => (
        <Card key={challenge.id} className="mb-4">
          <CardHeader>
            <CardTitle>{challenge.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Tipo: {challenge.type}</p>
            <p>Descripción: {challenge.description}</p>
            <h3 className="font-semibold mt-2 mb-1">Reglas:</h3>
            <ChallengeRulesDisplay rules={challenge.rules} />
            <div className="mt-4 space-x-2">
              <Button onClick={() => setEditingChallenge(challenge)}>
                Editar Reto
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteChallenge(challenge.id)}
              >
                Eliminar Reto
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleDuplicateChallenge(challenge.id)}
              >
                Duplicar Reto
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <h2 className="text-xl font-semibold mt-6 mb-4">Equipos</h2>
      <Button onClick={() => setShowAddTeamForm(true)} className="mb-4">
        Añadir Equipo
      </Button>
      {showAddTeamForm && (
        <TeamForm tournamentId={tournamentId} onTeamAdded={handleTeamAdded} />
      )}
      <TeamList tournamentId={tournamentId} />

      {editingChallenge && (
        <EditChallengeForm
          challenge={editingChallenge}
          onClose={() => setEditingChallenge(null)}
          onChallengeUpdated={handleChallengeUpdated}
        />
      )}
    </div>
  );
}
