// Importações de bibliotecas e módulos necessários
import { FastifyInstance } from "fastify";
import { createReadStream } from "node:fs";
import { z } from "zod";
import { openai } from "../lib/openai";
import { prisma } from "../lib/prisma";

// Função para criar a rota de transcrição
export async function createTranscriptionRoute(app: FastifyInstance) {
  // Define um esquema de validação para os parâmetros da rota
  const paramsSchema = z.object({
    videoId: z.string().uuid(),
  });

  // Define um esquema de validação para o corpo da requisição
  const bodySchema = z.object({
    prompt: z.string(),
  });

  // Configura a rota POST em "/videos/:videoId/transcription"
  app.post("/videos/:videoId/transcription", async (req) => {
    // Valida e extrai o parâmetro 'videoId' da URL
    const { videoId } = paramsSchema.parse(req.params);

    // Valida e extrai o corpo da requisição, incluindo o prompt
    const { prompt } = bodySchema.parse(req.body);

    // Consulta o banco de dados (usando Prisma) para encontrar informações sobre o vídeo
    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId,
      },
    });

    // Obtém o caminho do arquivo de áudio do vídeo
    const videoPath = video.path;

    // Cria um fluxo de leitura de arquivo de áudio a partir do caminho do vídeo
    const audioReadStream = createReadStream(videoPath);

    // Chama a API da OpenAI para gerar uma transcrição do áudio
    const response = await openai.audio.transcriptions.create({
      file: audioReadStream,
      model: "whisper-1",
      language: "pt",
      response_format: "json",
      temperature: 0,
      prompt,
    });

    // Obtém a transcrição gerada a partir da resposta da OpenAI
    const transcription = response.text;

    // Atualiza o registro do vídeo no banco de dados com a transcrição gerada
    await prisma.video.update({
      where: {
        id: videoId,
      },
      data: {
        transcription: transcription,
      },
    });

    // Retorna a transcrição como resposta da rota
    return { transcription };
  });
}
