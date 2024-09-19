"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useTournamentStore from "@/store/tournamentStore";

export default function EditTournamentForm({ tournament, onClose }) {
  const form = useForm({
    defaultValues: {
      name: tournament.name,
      startDate: new Date(tournament.startDate).toISOString().split("T")[0],
      endDate: new Date(tournament.endDate).toISOString().split("T")[0],
      status: tournament.status,
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateTournament = useTournamentStore(
    (state) => state.updateTournament
  );

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await updateTournament(tournament.id, data);
      alert("Torneo actualizado exitosamente");
      onClose();
    } catch (error) {
      console.error("Error updating tournament:", error);
      alert("Error al actualizar el torneo");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Torneo</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Torneo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Inicio</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Fin</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Actualizando..." : "Actualizar Torneo"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
