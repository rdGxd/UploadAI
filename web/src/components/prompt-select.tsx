import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Prompt = {
  id: string;
  title: string;
  template: string;
};

type PromptSelectedProps = {
  onPromptSelected: (template: string) => void;
};

export const PromptSelect = (props: PromptSelectedProps) => {
  const [prompts, setPrompts] = useState<Prompt[] | null>(null);

  // Quando o prompts mudar eu quero disparar uma função
  useEffect(() => {
    api.get("/prompts").then((response) => {
      setPrompts(response.data);
    });
  }, []);

  const handlePromptSelected = (promptId: string) => {
    const selectedPrompt = prompts?.find((prompt) => prompt.id === promptId);

    if (!selectedPrompt) return;

    props.onPromptSelected(selectedPrompt.template);
  };

  return (
    <Select onValueChange={handlePromptSelected}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione um prompt..." />
      </SelectTrigger>

      <SelectContent>
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
