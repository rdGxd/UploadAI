// Importa o componente Label do diretório "./ui/label"
import { Label } from "./ui/label";

// Importa os componentes relacionados a Select do diretório "./ui/select"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// Define o componente Modelo
export const Modelo = () => {
  return (
    // Define uma div com espaçamento vertical entre os elementos
    <div className="space-y-2">
      {/* Exibe um rótulo para o campo de seleção */}
      <Label>Modelo</Label>

      {/* Define um campo de seleção desabilitado com um valor padrão "gpt3.5" */}
      <Select disabled defaultValue="gpt3.5">
        {/* Define o gatilho para abrir o campo de seleção */}
        <SelectTrigger>
          {/* Exibe o valor selecionado atualmente */}
          <SelectValue />
        </SelectTrigger>

        {/* Define o conteúdo do campo de seleção */}
        <SelectContent>
          {/* Define um item de seleção com o valor "gpt3.5" */}
          <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
        </SelectContent>
      </Select>

      {/* Exibe uma mensagem informativa abaixo do campo de seleção */}
      <span className="block text-xs text-muted-foreground italic">
        Você poderá customizar essa opção em breve
      </span>
    </div>
  );
};
