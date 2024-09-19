import React from "react";

const ruleLabels = {
  tiempo_limite: "Tiempo límite",
  puntos_inicial: "Puntos iniciales",
  puntos_letra: "Puntos por letra",
  puntos_final: "Puntos por llegar al final",
  penalizacion_orden_incorrecto: "Penalización por orden incorrecto",
  puntos_vela: "Puntos por vela apagada",
  penalizacion_fuera_circulo: "Penalización por apagar fuera del círculo",
  penalizacion_obstaculo: "Penalización por obstáculo",
  puntos_torre: "Puntos por llegar a la torre",
  puntos_pelota: "Puntos por pelota depositada",
  puntos_regreso: "Puntos por regresar al inicio",
  puntos_totem: "Puntos por tótem retirado",
  puntos_totem_central: "Puntos por tótem central",
};

export default function ChallengeRulesDisplay({ rules }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {Object.entries(rules).map(([key, value]) => (
        <div key={key} className="flex justify-between">
          <span className="font-medium">{ruleLabels[key] || key}:</span>
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
}
