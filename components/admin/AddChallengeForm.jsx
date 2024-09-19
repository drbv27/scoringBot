"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";

const challengeRules = {
  baby_explorers: [
    {
      name: "tiempo_limite",
      label: "Tiempo límite (segundos)",
      type: "number",
    },
    { name: "puntos_inicial", label: "Puntos iniciales", type: "number" },
    { name: "puntos_letra", label: "Puntos por letra", type: "number" },
    {
      name: "puntos_final",
      label: "Puntos por llegar al final",
      type: "number",
    },
    {
      name: "penalizacion_orden_incorrecto",
      label: "Penalización por orden incorrecto",
      type: "number",
    },
  ],
  fire_fighting: [
    {
      name: "tiempo_limite",
      label: "Tiempo límite (segundos)",
      type: "number",
    },
    { name: "puntos_vela", label: "Puntos por vela apagada", type: "number" },
    {
      name: "penalizacion_fuera_circulo",
      label: "Penalización por apagar fuera del círculo (%)",
      type: "number",
    },
  ],
  explorers: [
    {
      name: "tiempo_limite",
      label: "Tiempo límite (segundos)",
      type: "number",
    },
    { name: "puntos_inicial", label: "Puntos iniciales", type: "number" },
    { name: "puntos_letra", label: "Puntos por letra", type: "number" },
    {
      name: "puntos_final",
      label: "Puntos por llegar al final",
      type: "number",
    },
    {
      name: "penalizacion_orden_incorrecto",
      label: "Penalización por orden incorrecto",
      type: "number",
    },
    {
      name: "penalizacion_obstaculo",
      label: "Penalización por obstáculo",
      type: "number",
    },
  ],
  line_following: [
    {
      name: "tiempo_limite",
      label: "Tiempo límite (segundos)",
      type: "number",
    },
    {
      name: "puntos_torre",
      label: "Puntos por llegar a la torre",
      type: "number",
    },
    {
      name: "puntos_pelota",
      label: "Puntos por pelota depositada",
      type: "number",
    },
    {
      name: "puntos_regreso",
      label: "Puntos por regresar al inicio",
      type: "number",
    },
  ],
  object_collector: [
    {
      name: "tiempo_limite",
      label: "Tiempo límite (segundos)",
      type: "number",
    },
    {
      name: "puntos_totem",
      label: "Puntos por tótem retirado",
      type: "number",
    },
    {
      name: "puntos_totem_central",
      label: "Puntos por tótem central",
      type: "number",
    },
    {
      name: "penalizacion_orden_incorrecto",
      label: "Penalización por orden incorrecto",
      type: "number",
    },
  ],
};

export default function AddChallengeForm({ tournamentId, onChallengeAdded }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      type: "",
      rules: {},
    },
  });

  useEffect(() => {
    if (selectedType) {
      const initialRules = {};
      challengeRules[selectedType].forEach((rule) => {
        initialRules[rule.name] = "";
      });
      form.reset({ ...form.getValues(), rules: initialRules });
    }
  }, [selectedType, form]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formattedData = {
        ...data,
        rules: Object.entries(data.rules).reduce((acc, [key, value]) => {
          acc[key] = value === "" ? null : Number(value);
          return acc;
        }, {}),
      };
      const response = await axios.post(
        `/api/tournaments/${tournamentId}/challenges`,
        formattedData
      );
      onChallengeAdded(response.data);
      form.reset();
      setSelectedType("");
    } catch (error) {
      console.error("Error adding challenge:", error);
      alert("Error al añadir el reto");
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
              <FormLabel>Nombre del Reto</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Reto</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedType(value);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo de reto" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="baby_explorers">
                    Baby Exploradores
                  </SelectItem>
                  <SelectItem value="fire_fighting">Fire Fighting</SelectItem>
                  <SelectItem value="explorers">Exploradores</SelectItem>
                  <SelectItem value="line_following">Line Following</SelectItem>
                  <SelectItem value="object_collector">
                    Recolector de Objetos
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {selectedType &&
          challengeRules[selectedType].map((rule) => (
            <FormField
              key={rule.name}
              control={form.control}
              name={`rules.${rule.name}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{rule.label}</FormLabel>
                  <FormControl>
                    <Input
                      type={rule.type}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Añadiendo..." : "Añadir Reto"}
        </Button>
      </form>
    </Form>
  );
}
