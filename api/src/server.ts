// Importações de bibliotecas e módulos necessários
import { fastifyCors } from "@fastify/cors";
import { fastify } from "fastify";
import { createTranscriptionRoute } from "./routes/create-transcription";
import { generateAICompleteRoute } from "./routes/generate-ai-completion";
import { getAllPromptsRoute } from "./routes/get-all-prompts";
import { uploadVideoRoute } from "./routes/upload-video";

// Cria uma instância do servidor Fastify
const app = fastify();

// Registra o plugin Fastify-CORS para permitir solicitações de qualquer origem (*)
app.register(fastifyCors, {
  origin: "*",
});

// Registra as rotas da API definidas em arquivos separados
app.register(getAllPromptsRoute); // Rota para buscar todos os prompts
app.register(uploadVideoRoute); // Rota para fazer upload de vídeos
app.register(createTranscriptionRoute); // Rota para criar transcrições de áudio
app.register(generateAICompleteRoute); // Rota para solicitar completions de IA

// Inicia o servidor HTTP na porta 3333
app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("HTTP SERVER Running!");
  });
