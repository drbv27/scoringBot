import { create } from "zustand";
import axios from "axios";

const useTournamentStore = create((set) => ({
  tournaments: [],
  isLoading: false,
  error: null,
  fetchTournaments: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get("/api/tournaments");
      set({ tournaments: response.data, isLoading: false, error: null });
    } catch (error) {
      set({ error: "Error al cargar los torneos", isLoading: false });
    }
  },
  addTournament: async (tournamentData) => {
    set({ isLoading: true });
    try {
      const response = await axios.post("/api/tournaments", tournamentData);
      set((state) => ({
        tournaments: [...state.tournaments, response.data],
        isLoading: false,
        error: null,
      }));
      return response.data;
    } catch (error) {
      set({ error: "Error al crear el torneo", isLoading: false });
      throw error;
    }
  },

  updateTournament: async (tournamentId, tournamentData) => {
    set({ isLoading: true });
    try {
      const response = await axios.put(
        `/api/tournaments/${tournamentId}`,
        tournamentData
      );
      set((state) => ({
        tournaments: state.tournaments.map((t) =>
          t.id === tournamentId ? response.data : t
        ),
        isLoading: false,
        error: null,
      }));
      return response.data;
    } catch (error) {
      set({ error: "Error al actualizar el torneo", isLoading: false });
      throw error;
    }
  },
  deleteTournament: async (tournamentId) => {
    set({ isLoading: true });
    try {
      await axios.delete(`/api/tournaments/${tournamentId}`);
      set((state) => ({
        tournaments: state.tournaments.filter((t) => t.id !== tournamentId),
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({ error: "Error al eliminar el torneo", isLoading: false });
      throw error;
    }
  },
}));

export default useTournamentStore;
