import http from './http'

export interface Modalidade {
  idmodalidade: number
  nome: string
  situacao: number
  criado_em: string
  alunos_count: number
  turmas_count: number
}

export interface ModalidadeForm {
  idmodalidade?: number
  nome: string
  situacao: number
}

export async function listarModalidades(): Promise<Modalidade[]> {
  const res = await http.get('/modalidades')
  return res.data?.data ?? []
}

export async function cadastrarModalidade(dados: ModalidadeForm): Promise<any> {
  const res = await http.post('/modalidades', dados)
  return res.data
}

export async function editarModalidade(id: number, dados: ModalidadeForm): Promise<any> {
  const res = await http.put(`/modalidades/${id}`, dados)
  return res.data
}

export async function toggleStatusModalidade(id: number, situacao: number): Promise<any> {
  const res = await http.patch(`/modalidades/${id}/status`, { situacao })
  return res.data
}
