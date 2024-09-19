"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
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

export default function TeamForm({
  tournamentId,
  onTeamAdded,
  initialData = null,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    defaultValues: initialData || {
      name: "",
      city: "",
      coach: {
        name: "",
        email: "",
        documentId: "",
        phone: "",
      },
      participants: [{ name: "", dateOfBirth: "" }],
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        participants: initialData.participants.map((p) => ({
          ...p,
          dateOfBirth: p.dateOfBirth
            ? new Date(p.dateOfBirth).toISOString().split("T")[0]
            : "",
        })),
      });
    }
  }, [initialData, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "participants",
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formattedParticipants = data.participants.map((participant) => ({
        ...participant,
        dateOfBirth: participant.dateOfBirth
          ? new Date(participant.dateOfBirth).toISOString()
          : null,
      }));

      const response = initialData
        ? await axios.put(`/api/teams/${initialData.id}`, {
            ...data,
            tournamentId,
            participants: formattedParticipants,
          })
        : await axios.post("/api/teams", {
            ...data,
            tournamentId,
            participants: formattedParticipants,
          });
      onTeamAdded(response.data);
      if (!initialData) {
        form.reset(); // Solo resetea el formulario si es una nueva creación
      }
    } catch (error) {
      console.error("Error submitting team:", error.response?.data || error);
      alert(`Error: ${error.response?.data?.details || error.message}`);
    }
    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Equipo</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ciudad</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="border p-4 rounded-md">
          <h3 className="font-semibold mb-2">Coach</h3>
          <FormField
            control={form.control}
            name="coach.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Coach</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="coach.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email del Coach</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="coach.documentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Documento de Identidad del Coach</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="coach.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono del Coach</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <h3 className="font-semibold mb-2">Participantes</h3>
          {fields.map((field, index) => (
            <div key={field.id} className="border p-4 rounded-md mb-4">
              <FormField
                control={form.control}
                name={`participants.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Participante</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`participants.${index}.dateOfBirth`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Nacimiento</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                onClick={() => remove(index)}
                className="mt-2"
              >
                Eliminar Participante
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => append({ name: "", dateOfBirth: "" })}
          >
            Añadir Participante
          </Button>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Guardando..."
            : initialData
            ? "Actualizar Equipo"
            : "Crear Equipo"}
        </Button>
      </form>
    </Form>
  );
}
