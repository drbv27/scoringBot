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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

export default function EditChallengeForm({
  challenge,
  onClose,
  onChallengeUpdated,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    defaultValues: {
      name: challenge.name,
      description: challenge.description,
      type: challenge.type,
      rules: challenge.rules,
    },
  });

  useEffect(() => {
    if (challenge.type) {
      const initialRules = {};
      challengeRules[challenge.type].forEach((rule) => {
        initialRules[rule.name] = challenge.rules[rule.name] || "";
      });
      form.reset({ ...challenge, rules: initialRules });
    }
  }, [challenge, form]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formattedData = {
        name: data.name,
        description: data.description,
        type: data.type,
        rules: Object.entries(data.rules).reduce((acc, [key, value]) => {
          acc[key] = value === "" ? null : Number(value);
          return acc;
        }, {}),
      };
      const response = await axios.put(
        `/api/challenges/${challenge.id}`,
        formattedData
      );
      onChallengeUpdated(response.data);
      onClose();
    } catch (error) {
      console.error("Error updating challenge:", error);
      alert("Error al actualizar el reto");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Reto</DialogTitle>
        </DialogHeader>
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo de reto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="baby_explorers">
                        Baby Exploradores
                      </SelectItem>
                      <SelectItem value="fire_fighting">
                        Fire Fighting
                      </SelectItem>
                      <SelectItem value="explorers">Exploradores</SelectItem>
                      <SelectItem value="line_following">
                        Line Following
                      </SelectItem>
                      <SelectItem value="object_collector">
                        Recolector de Objetos
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {challengeRules[form.watch("type")]?.map((rule) => (
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
              {isSubmitting ? "Actualizando..." : "Actualizar Reto"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
