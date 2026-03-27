import http, { saveAuth } from './http';

/**
 * Efetua login no backend e salva os dados de autenticação no localStorage
 * @param login - nome de usuário/login
 * @param password - senha
 * @returns resposta completa da API
 */
export async function efetuarLogin(login: string, password: string) {
  try {
    const res = await http.post('/login', { login, password });
    const body = res.data ?? {};

    const user = body?.data?.auth_user ?? body?.auth_user;
    const token = body?.data?.token ?? body?.token;
    const expires_in = body?.data?.expires_in ?? body?.expires_in ?? 86400;

    if (!token) {
      throw new Error('Token ausente na resposta de login');
    }

    saveAuth(token, expires_in, user);

    return body;
  } catch (error: any) {
    const data = error.response?.data as any;
    const message = data?.message || data?.error || error.message || 'Falha ao realizar login';
    throw new Error(message);
  }
}
