// Importa a biblioteca Axios
import axios from "axios";

// Cria uma instância do cliente Axios configurada com a base URL
export const api = axios.create({
  baseURL: "http://localhost:3333", // Define a URL base como "http://localhost:3333"
});
