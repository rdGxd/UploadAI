// Importações de bibliotecas e módulos necessários
import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

// Função para criar a rota de busca de todos os prompts
export async function getAllPromptsRoute(app: FastifyInstance) {
  // Configura a rota GET em "/prompts"
  app.get("/prompts", async () => {
    // Consulta o banco de dados (usando Prisma) para buscar todos os prompts
    const prompts = await prisma.prompt.findMany();

    // Retorna os prompts como resposta da rota
    return prompts;
  });
}
