// Importa o componente Separator do diretório "./ui/separator"
import { Separator } from "./ui/separator";

// Importa o ícone Github do pacote "lucide-react"
import { Github } from "lucide-react";

// Importa o componente Button do diretório "./ui/button"
import { Button } from "./ui/button";

// Define o componente de cabeçalho
export const Header = () => {
  return (
    // Define a estrutura HTML do cabeçalho
    <header className="px-6 py-3 flex items-center justify-between border-b">
      {/* Define o título principal do cabeçalho */}
      <h1 className="text-xl font-bold">Upload.ai</h1>

      {/* Define uma seção à direita do cabeçalho com informações adicionais */}
      <div className="flex items-center gap-3">
        {/* Exibe o texto "Desenvolvido por Rodrigo Silva" com estilo de texto pequeno */}
        <span className="text-sm text-muted-foreground">
          Desenvolvido por Rodrigo Silva
        </span>

        {/* Adiciona um componente Separator na vertical com altura de 6 unidades */}
        <Separator orientation="vertical" className="h-6" />

        {/* Cria um botão com a variante "outline" */}
        <Button variant="outline">
          {/* Insere o ícone Github seguido pelo texto "Github" */}
          <Github className="w-4 h-4 mr-2" />
          Github
        </Button>
      </div>
    </header>
  );
};
