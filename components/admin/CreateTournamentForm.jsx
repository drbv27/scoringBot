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
import useTournamentStore from "@/store/tournamentStore";

export default function CreateTournamentForm() {
  const form = useForm({
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addTournament = useTournamentStore((state) => state.addTournament);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await addTournament(data);
      form.reset();
      alert("Torneo creado exitosamente");
    } catch (error) {
      console.error("Error creating tournament:", error);
      alert("Error al crear el torneo");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
                <Input type="date" {...field} value={field.value || ""} />
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
                <Input type="date" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creando..." : "Crear Torneo"}
        </Button>
      </form>
    </Form>
  );
}
