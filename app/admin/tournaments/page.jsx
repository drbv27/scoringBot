import TournamentList from "@/components/admin/TournamentList";
import CreateTournamentForm from "@/components/admin/CreateTournamentForm";

export default function AdminTournamentsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Administración de Torneos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Torneos Existentes</h2>
          <TournamentList />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Crear Nuevo Torneo</h2>
          <CreateTournamentForm />
        </div>
      </div>
    </div>
  );
}
