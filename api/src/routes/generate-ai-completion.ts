// Importações de bibliotecas e módulos necessários
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { openai } from "../lib/openai";
import { prisma } from "../lib/prisma";

// Função para criar a rota de geração de completions da IA
export async function generateAICompleteRoute(app: FastifyInstance) {
  // Define um esquema de validação para o corpo da requisição
  const bodySchema = z.object({
    videoId: z.string().uuid(), // ID do vídeo
    template: z.string(), // Modelo/template
    temperature: z.number().min(0).max(1).default(0.5), // Temperatura (valor entre 0 e 1)
  });

  // Configura a rota POST em "/ai/complete"
  app.post("/ai/complete", async (req, reply) => {
    // Valida e extrai os dados do corpo da requisição
    const { videoId, temperature, template } = bodySchema.parse(req.body);

    // Consulta o banco de dados (usando Prisma) para encontrar informações sobre o vídeo
    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId,
      },
    });

    // Verifica se a transcrição do vídeo está disponível
    if (!video.transcription) {
      return reply
        .status(400) // Define o código de status da resposta como 400 (Bad Request)
        .send({ error: "Video transcription was not generated yet." });
    }

    // Substitui a variável {transcription} no modelo/template pelo texto da transcrição do vídeo
    const promptMessage = template.replace(
      "{transcription}",
      video.transcription
    );

    // Chama a API da OpenAI para gerar completions (geração de texto) usando o modelo especificado
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k", // Modelo da IA da OpenAI
      temperature, // Temperatura para controlar a criatividade (entre 0 e 1)
      messages: [
        {
          role: "user",
          content: promptMessage, // Mensagem de prompt com a transcrição inserida
        },
      ],
    });

    // Retorna a resposta da API da OpenAI como resposta da rota
    return response;
  });
}
