// Importações de bibliotecas e módulos necessários
import { fastifyMultipart } from "@fastify/multipart";
import { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import { prisma } from "../lib/prisma";

const pump = promisify(pipeline);

// Função para criar a rota de upload de vídeo
export async function uploadVideoRoute(app: FastifyInstance) {
  // Registra o plugin Fastify-Multipart para lidar com o upload de arquivos
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1_048_576 * 30, // Limite de tamanho de arquivo: 30 MB
    },
  });

  // Configura a rota POST em "/videos"
  app.post("/videos", async (request, reply) => {
    // Obtém os dados do arquivo de vídeo enviado na requisição
    const data = await request.file();

    // Verifica se foi fornecido um arquivo na requisição
    if (!data) {
      return reply.status(400).send({ error: "Missing file input." });
    }

    // Obtém a extensão do arquivo de vídeo
    const extension = path.extname(data.filename);

    // Verifica se o arquivo tem a extensão .mp3 (vídeo no formato MP3)
    if (extension !== ".mp3") {
      return reply
        .status(400)
        .send({ error: "Invalid input type, please upload an MP3." });
    }

    // Gera um nome de arquivo único para o vídeo, usando um UUID
    const fileBaseName = path.basename(data.filename, extension);
    const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`;

    // Define o caminho de destino para o arquivo de upload
    const uploadDestination = path.resolve(
      __dirname,
      "../../tmp",
      fileUploadName
    );

    // Realiza a cópia do conteúdo do arquivo de vídeo para o destino
    await pump(data.file, fs.createWriteStream(uploadDestination));

    // Cria um registro do vídeo no banco de dados (usando Prisma)
    const video = await prisma.video.create({
      data: {
        name: data.filename,
        path: uploadDestination,
      },
    });

    // Retorna informações sobre o vídeo como resposta da rota
    return {
      video,
    };
  });
}
