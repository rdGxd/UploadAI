// Importações das URLs necessárias para o FFmpeg
import { FFmpeg } from "@ffmpeg/ffmpeg";
import coreURL from "../ffmpeg/ffmpeg-core.js?url";
import wasmURL from "../ffmpeg/ffmpeg-core.wasm?url";
import workerURL from "../ffmpeg/ffmpeg-worker.js?url";

// Variável para armazenar a instância do FFmpeg
let ffmpeg: FFmpeg | null;

// Função para obter uma instância do FFmpeg
export const getFFMpeg = async () => {
  // Se já tivermos uma instância do FFmpeg, a retornamos
  if (ffmpeg) return ffmpeg;

  // Caso contrário, criamos uma nova instância do FFmpeg
  ffmpeg = new FFmpeg();

  // Se o FFmpeg ainda não estiver carregado, carregamos seus recursos
  if (!ffmpeg.loaded) {
    await ffmpeg.load({
      coreURL, // URL para o núcleo do FFmpeg
      wasmURL, // URL para o arquivo WASM do FFmpeg
      workerURL, // URL para o worker do FFmpeg
    });
  }

  // Retornamos a instância do FFmpeg
  return ffmpeg;
};
