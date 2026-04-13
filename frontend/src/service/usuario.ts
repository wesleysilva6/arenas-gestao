import http, { saveAuth, getToken } from './http'

/** Buscar dados do perfil do usuário logado */
export async function buscarPerfil() {
  const res = await http.get('/usuario/perfil')
  return res.data?.data ?? res.data
}

/** Atualizar nome e email */
export async function atualizarDados(nome: string, email: string) {
  const res = await http.put('/usuario/dados', { nome, email })
  const user = res.data?.data ?? res.data
  // Atualiza o localStorage com os dados novos
  if (user) {
    const token = getToken()
    if (token) {
      saveAuth(token, 86400, user)
    }
  }
  return user
}

/** Verificar se a senha atual está correta */
export async function verificarSenha(senhaAtual: string) {
  const res = await http.post('/usuario/verificar-senha', { senha_atual: senhaAtual })
  return res.data
}

/** Alterar a senha */
export async function alterarSenha(senhaAtual: string, novaSenha: string) {
  const res = await http.put('/usuario/senha', { senha_atual: senhaAtual, nova_senha: novaSenha })
  return res.data
}
