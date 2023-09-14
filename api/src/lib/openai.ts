// Importa a biblioteca "dotenv" para carregar variáveis de ambiente a partir de um arquivo .env
import "dotenv/config";

// Importa a biblioteca "OpenAI" para utilizar os recursos da OpenAI
import OpenAI from "openai";

// Cria uma instância do cliente OpenAI com a chave de API fornecida no arquivo de variáveis de ambiente (.env)
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY, // Chave de API da OpenAI armazenada em uma variável de ambiente
});
