"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TeamForm from "./TeamForm";

export default function TeamList({ tournamentId }) {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTeam, setEditingTeam] = useState(null);

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/api/teams?tournamentId=${tournamentId}`
      );
      setTeams(response.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTeams();
  }, [tournamentId]);

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este equipo?")) {
      try {
        await axios.delete(`/api/teams/${teamId}`);
        fetchTeams(); // Recargar la lista después de eliminar
      } catch (error) {
        console.error("Error deleting team:", error);
        alert("Error al eliminar el equipo");
      }
    }
  };

  const handleEditTeam = (team) => {
    setEditingTeam(team);
  };

  const handleTeamUpdated = () => {
    setEditingTeam(null);
    fetchTeams(); // Recargar la lista después de editar
  };

  const handleTeamAdded = () => {
    fetchTeams(); // Recargar la lista después de añadir
  };

  if (isLoading) return <div>Cargando equipos...</div>;

  return (
    <div className="space-y-4">
      <TeamForm tournamentId={tournamentId} onTeamAdded={handleTeamAdded} />
      {teams.map((team) => (
        <Card key={team.id}>
          <CardHeader>
            <CardTitle>{team.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Ciudad: {team.city}</p>
            <p>Coach: {team.coach.name}</p>
            <p>Email del Coach: {team.coach.email}</p>
            <p>Teléfono del Coach: {team.coach.phone}</p>
            <h4 className="font-semibold mt-2">Participantes:</h4>
            <ul>
              {team.participants.map((participant, index) => (
                <li key={index}>
                  {participant.name} - Nacimiento:{" "}
                  {new Date(participant.dateOfBirth).toLocaleDateString()}
                </li>
              ))}
            </ul>
            <div className="mt-4 space-x-2">
              <Button onClick={() => handleEditTeam(team)}>Editar</Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteTeam(team.id)}
              >
                Eliminar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      {editingTeam && (
        <TeamForm
          tournamentId={tournamentId}
          initialData={editingTeam}
          onTeamAdded={handleTeamUpdated}
        />
      )}
    </div>
  );
}
