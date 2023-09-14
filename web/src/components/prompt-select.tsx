// Importa o cliente Axios chamado 'api' do diretório "@/lib/axios"
import { api } from "@/lib/axios";

// Importa os hooks useEffect e useState do React
import { useEffect, useState } from "react";

// Importa os componentes relacionados a Select do diretório "./ui/select"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// Define o tipo 'Prompt' que representa um objeto Prompt
type Prompt = {
  id: string;
  title: string;
  template: string;
};

// Define as propriedades esperadas para o componente PromptSelect
type PromptSelectedProps = {
  onPromptSelected: (template: string) => void;
};

// Define o componente PromptSelect
export const PromptSelect = (props: PromptSelectedProps) => {
  // Define um estado 'prompts' que vai armazenar os prompts
  const [prompts, setPrompts] = useState<Prompt[] | null>(null);

  // Quando o componente monta, busca os prompts da API
  useEffect(() => {
    api.get("/prompts").then((response) => {
      setPrompts(response.data);
    });
  }, []);

  // Função para lidar com a seleção de um prompt
  const handlePromptSelected = (promptId: string) => {
    // Encontra o prompt selecionado com base no 'promptId'
    const selectedPrompt = prompts?.find((prompt) => prompt.id === promptId);

    // Se o prompt selecionado não existe, sai da função
    if (!selectedPrompt) return;

    // Chama a função 'onPromptSelected' passando o template do prompt
    props.onPromptSelected(selectedPrompt.template);
  };

  return (
    // Renderiza o componente Select
    <Select onValueChange={handlePromptSelected}>
      {/* Define o gatilho para abrir o campo de seleção */}
      <SelectTrigger>
        {/* Exibe o valor selecionado atualmente ou um placeholder */}
        <SelectValue placeholder="Selecione um prompt..." />
      </SelectTrigger>

      {/* Define o conteúdo do campo de seleção */}
      <SelectContent>
        {/* Mapeia os prompts e cria um item de seleção para cada um */}
        {prompts?.map((prompt) => {
          return (
            <SelectItem key={prompt.id} value={prompt.id}>
              {prompt.title}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
