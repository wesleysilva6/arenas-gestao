import axios, { AxiosError, type AxiosInstance } from 'axios';
import { showError } from '../utils/alertas';

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8085';

// Funções de autenticação (localStorage)
export const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const isTokenValid = (): boolean => {
  const exp = localStorage.getItem('auth_token_exp');
  if (!exp) return false;
  return parseInt(exp) > Date.now() / 1000;
};

export const saveAuth = (
  token: string,
  expires_in: number,
  user: any
): void => {
  localStorage.setItem('auth_token', token);
  localStorage.setItem(
    'auth_token_exp',
    String(Date.now() / 1000 + expires_in)
  );
  localStorage.setItem('auth_user', JSON.stringify(user));
};

export const clearAuth = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_token_exp');
  localStorage.removeItem('auth_user');
};

export const getUser = (): any => {
  const user = localStorage.getItem('auth_user');
  return user ? JSON.parse(user) : null;
};

// Criar instância do axios
const http: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de requisição: adicionar token
http.interceptors.request.use(
  config => {
    const token = getToken();
    if (token && isTokenValid()) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor de resposta: tratar erros de autenticação e exibir mensagens
http.interceptors.response.use(
  response => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    // Se 401 ou 403, limpar auth e redirecionar para login
    if (status === 401 || status === 403) {
      clearAuth();
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // Capturar mensagem de erro da API e exibir
    if (message) {
      showError(message);
    } else if (status === 400) {
      showError('Requisição inválida. Verifique os dados enviados.');
    } else if (status === 404) {
      showError('Recurso não encontrado.');
    } else if (status === 500) {
      showError('Erro interno do servidor. Tente novamente mais tarde.');
    } else if (error.message) {
      showError(error.message);
    } else {
      showError('Erro ao processar requisição.');
    }

    return Promise.reject(error);
  }
);

export default http;
