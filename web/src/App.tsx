// Importações de bibliotecas e componentes
import { useCompletion } from "ai/react";
import { Wand2 } from "lucide-react";
import { useState } from "react";
import { Header } from "./components/header";
import { Modelo } from "./components/modelo";
import { PromptSelect } from "./components/prompt-select";
import { Button } from "./components/ui/button";
import { Label } from "./components/ui/label";
import { Separator } from "./components/ui/separator";
import { Slider } from "./components/ui/slider";
import { Textarea } from "./components/ui/textarea";
import { VideoInputForm } from "./components/video-input-form";

// Definição do componente 'App'
export function App() {
  // Estados para controlar a temperatura, o ID do vídeo e o input
  const [temperature, setTemperature] = useState(0.5);
  const [videoId, setVideoId] = useState<string | null>(null);

  // Hook 'useCompletion' para lidar com a geração de texto da IA
  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
  } = useCompletion({
    api: "http:localhost:3333/ai/complete",
    body: {
      videoId,
      temperature,
    },
    headers: {
      "Content-type": "application/json",
    },
  });

  return (
    <>
      {/* Componente Header */}
      <Header />

      {/* Estrutura principal do aplicativo */}
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 p-6 flex gap-6">
          <div className="flex flex-col flex-1 gap-4">
            <div className="grid grid-rows-2 gap-4 flex-1">
              {/* Área de entrada de texto */}
              <Textarea
                className="resize-none p-4 leading-relaxed"
                placeholder="Inclua o prompt para a IA..."
                value={input}
                onChange={handleInputChange}
              />
              {/* Resultado gerado pela IA (somente leitura) */}
              <Textarea
                className="resize-none p-4 leading-relaxed"
                placeholder="Resultado gerado pela IA"
                readOnly
                value={completion}
              />
            </div>
            {/* Informação adicional */}
            <p className="text-sm text-muted-foreground">
              Lembre-se: você pode utilizar a variável{" "}
              <code className="text-violet-400">{"{transcription}"}</code> no
              seu prompt para adicionar o conteúdo da transcrição do vídeo
              selecionado.
            </p>
          </div>
          {/* Sidebar com opções */}
          <aside className="w-80 space-y-6">
            {/* Componente VideoInputForm para fazer upload de vídeos */}
            <VideoInputForm onVideoUploaded={setVideoId} />
            <Separator />

            {/* Formulário para configurações e execução */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Prompt</Label>
                {/* Componente PromptSelect para seleção de prompt */}
                <PromptSelect onPromptSelected={setInput} />
              </div>

              {/* Componente Modelo para configuração */}
              <Modelo />

              <Separator />

              <div className="space-y-4">
                <Label>Temperatura</Label>
                {/* Componente Slider para ajustar a temperatura */}
                <Slider
                  min={0}
                  max={1}
                  step={0.1}
                  value={[temperature]}
                  onValueChange={(value) => setTemperature(value[0])}
                />
                {/* Informação sobre a temperatura */}
                <span className="block text-xs text-muted-foreground italic leading-relaxed">
                  Valores mais altos tendem a deixar o resultado mais criativo e
                  com possíveis erros.
                </span>
              </div>

              <Separator />

              {/* Botão para executar a geração de texto */}
              <Button disabled={isLoading} type="submit" className="w-full">
                Executar
                <Wand2 className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </aside>
        </main>
      </div>
    </>
  );
}

// Exporta o componente 'App' como padrão
export default App;
