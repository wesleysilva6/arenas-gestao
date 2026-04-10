import http from './http'

export interface Aluno {
  idaluno: number
  nome: string
  telefone: string
  modalidade_id: number
  modalidade_nome: string
  data_inicio: string | null
  dia_vencimento: number
  notificacao_whatsapp: number
  situacao: number
  observacao: string | null
  criado_em: string
  valor_mensalidade: number
  plano: string
  data_inicio_contrato: string | null
  data_vencimento_contrato: string | null
}

export interface Modalidade {
  idmodalidade: number
  nome: string
}

export async function listarAlunos(): Promise<Aluno[]> {
  const res = await http.get('/alunos')
  return res.data?.data ?? []
}

export async function buscarAluno(id: number): Promise<Aluno> {
  const res = await http.get(`/alunos/${id}`)
  return res.data?.data
}

export async function cadastrarAluno(dados: Partial<Aluno>): Promise<any> {
  const res = await http.post('/alunos', dados)
  return res.data
}

export async function editarAluno(id: number, dados: Partial<Aluno>): Promise<any> {
  const res = await http.put(`/alunos/${id}`, dados)
  return res.data
}

export async function deletarAluno(id: number): Promise<any> {
  const res = await http.delete(`/alunos/${id}`)
  return res.data
}

export async function cancelarAluno(id: number): Promise<any> {
  const res = await http.patch(`/alunos/${id}/cancelar`)
  return res.data
}

export async function listarModalidades(): Promise<Modalidade[]> {
  const res = await http.get('/alunos/modalidades')
  return res.data?.data ?? []
}
