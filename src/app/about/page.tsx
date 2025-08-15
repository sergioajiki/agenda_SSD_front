import React from "react";

import { healthService } from "@/services/healthService";
import { HealthData } from "@/models/Health";

export default async function AboutPage() {
  let healthData: HealthData | null = null;

  try {
    //Obtém os dados do serviço de health
    healthData = await healthService() as HealthData;
  } catch (error) {
    console.error("Erro ao obter informações de health", error);
  }

  //Mensagem de erro caso não tenha conseguido obter os dados
  if (!healthData) {
    return (
      <div>
        <h1>
          Erro ao obter informações de health
          <p>Não foi possível carregar os dados do serviço de health</p>
        </h1>
      </div>
    );
  };

  return (
    <div>
      <h1>
        Sobre o Sistema
      </h1>
      <ul>
        <li><strong>Nome da aplicação: Agenda_SSD</strong></li>
        <li><strong>Nome da Api:</strong> {healthData.applicationName}</li>
        <li><strong>Versão:</strong> {healthData.version}</li>
        <li><strong>Status:</strong> {healthData.status}</li>
        <li><strong>Status do Banco de Dados:</strong> {healthData.databaseStatus}</li>
        <li><strong>Memória Total:</strong> {healthData.totalMemory}</li>
        <li><strong>Memória Livre:</strong> {healthData.freeMemory}</li>
        <li><strong>Memória Máxima:</strong> {healthData.maxMemory}</li>
        <li><strong>Tempo de Atividade:</strong> {healthData.uptime}</li>
        <li><strong>Timestamp:</strong> {healthData.timestamp}</li>
      </ul>
    </div>
  )
}