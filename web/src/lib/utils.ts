// Importa as funções e tipos necessários das bibliotecas clsx e tailwind-merge
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Define uma função chamada 'cn' para combinar e mesclar classes CSS
export function cn(...inputs: ClassValue[]) {
  // Usa a função 'clsx' para combinar as classes fornecidas como argumentos
  // A função 'clsx' é responsável por gerenciar classes CSS condicionalmente
  // e elimina classes vazias ou duplicadas.
  const combinedClasses = clsx(inputs);

  // Usa a função 'twMerge' para mesclar as classes combinadas com as classes do Tailwind CSS
  // Isso permite que você combine facilmente classes personalizadas com classes do Tailwind CSS.
  const mergedClasses = twMerge(combinedClasses);

  // Retorna as classes CSS resultantes
  return mergedClasses;
}
