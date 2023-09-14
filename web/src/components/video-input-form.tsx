// Importações de bibliotecas e componentes
import { api } from "@/lib/axios";
import { getFFMpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { FileVideo, Upload } from "lucide-react";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";

// Definição dos possíveis estados da aplicação
type Status = "waiting" | "converting" | "uploading" | "generating" | "success";

// Mensagens correspondentes aos estados da aplicação
const statusMessages = {
  converting: "Convertendo...",
  generating: "Transcrevendo...",
  uploading: "Carregando...",
  success: "Sucesso",
};

// Propriedades esperadas para o componente VideoInputForm
type VideoInputFormProps = {
  onVideoUploaded: (id: string) => void;
};

// Definição do componente VideoInputForm
export const VideoInputForm = (props: VideoInputFormProps) => {
  // Estados para controlar o arquivo de vídeo, status e referência para o campo de prompt
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("waiting");
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  // Função para lidar com a seleção de um arquivo de vídeo
  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.currentTarget;
    if (!files) return;

    const selectedFile = files[0];
    setVideoFile(selectedFile);
  };

  // Função para converter vídeo em áudio usando FFMpeg
  const convertVideoToAudio = async (video: File) => {
    console.log("Conversão iniciada.");

    const ffmpeg = await getFFMpeg();

    await ffmpeg.writeFile("input.mp4", await fetchFile(video));

    // ffmpeg.on("log", (log) => {
    //   console.log(log);
    // });

    ffmpeg.on("progress", (progress) => {
      console.log(
        `Progresso da conversão: ${Math.round(progress.progress * 100)}`
      );
    });

    await ffmpeg.exec([
      "-i",
      "input.mp4",
      "-map",
      "0:a",
      "-b:a",
      "20k",
      "-acodec",
      "libmp3lame",
      "output.mp3",
    ]);

    const data = await ffmpeg.readFile("output.mp3");

    const audioFileBlob = new Blob([data], { type: "audio/mpeg" });
    const audioFile = new File([audioFileBlob], "audio.mp3", {
      type: "audio/mpeg",
    });

    console.log("Conversão concluída.");
    return audioFile;
  };

  // Função para lidar com o envio do vídeo
  const handleUploadVideo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const prompt = promptInputRef.current?.value;

    if (!videoFile) return;
    setStatus("converting");

    // Converter o vídeo em áudio
    const audioFile = await convertVideoToAudio(videoFile);

    const data = new FormData();

    data.append("file", audioFile);
    setStatus("uploading");

    const response = await api.post("/videos", data);

    const videoId = response.data.video.id;
    setStatus("generating");

    await api.post(`/video/${videoId}/transcription`, {
      prompt,
    });
    setStatus("success");
    props.onVideoUploaded(videoId);
    console.log("Concluído");
  };

  // URL de visualização do vídeo
  const previewURL = useMemo(() => {
    if (!videoFile) return null;

    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  return (
    <form className="space-y-6" onSubmit={handleUploadVideo}>
      {/* Componente para selecionar um arquivo de vídeo */}
      <label
        htmlFor="video"
        className="relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/10"
      >
        {previewURL ? (
          <video
            src={previewURL}
            controls={false}
            className="pointer-events-none absolute inset-0"
          />
        ) : (
          <>
            <FileVideo className="w-4 h-4" />
            Selecione um vídeo
          </>
        )}
      </label>

      {/* Campo oculto para selecionar o arquivo de vídeo */}
      <input
        type="file"
        id="video"
        accept="video/mp4"
        className="sr-only"
        onChange={handleFileSelected}
      />

      {/* Componente Separator para separar elementos */}
      <Separator />

      <div className="space-y-2">
        {/* Rótulo e campo de entrada de prompt de transcrição */}
        <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
        <Textarea
          ref={promptInputRef}
          disabled={status !== "waiting"}
          id="transcription_prompt"
          className="h-20 leading-relaxed resize-none"
          placeholder="Inclua palavras-chaves mencionadas no vídeo separadas com vírgula (,)"
        />
      </div>

      {/* Botão para enviar o vídeo */}
      <Button
        data-success={status === "success"}
        disabled={status !== "waiting"}
        type="submit"
        className="w-full data-[success=true]:bg-emerald-400"
      >
        {status === "waiting" ? (
          <>
            Carregar vídeo
            <Upload className="w-4 ml-2" />
          </>
        ) : (
          statusMessages[status]
        )}
      </Button>
    </form>
  );
};
