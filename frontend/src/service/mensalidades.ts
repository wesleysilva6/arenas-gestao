import http from './http'

export interface Mensalidade {
  idmensalidade: number
  aluno_id: number
  valor: number
  mes_referencia: string
  data_vencimento: string
  data_pagamento: string | null
  situacao: number // 0=pendente, 1=pago, 2=atrasada
  criado_em: string
  aluno_nome: string
  aluno_telefone: string
}

export async function listarMensalidades(): Promise<Mensalidade[]> {
  const res = await http.get('/mensalidades')
  const data: Mensalidade[] = res.data?.data ?? []
  return data.map((m) => ({ ...m, valor: Number(m.valor) }))
}

export async function confirmarPagamento(id: number): Promise<any> {
  const res = await http.patch(`/mensalidades/${id}/confirmar`)
  return res.data
}

export async function gerarMesAtual(mesReferencia: string): Promise<{ geradas: number; message: string }> {
  const res = await http.post('/mensalidades/gerar', { mes_referencia: mesReferencia })
  return res.data
}

export async function contarSemMensalidade(mesReferencia: string): Promise<number> {
  const res = await http.get('/mensalidades/sem-mensalidade', { params: { mes_referencia: mesReferencia } })
  return res.data?.total ?? 0
}

export function getMesReferenciaAtual(): string {
  const now = new Date()
  const ano = now.getFullYear()
  const mes = String(now.getMonth() + 1).padStart(2, '0')
  return `${ano}-${mes}`
}

export function formatMesReferencia(mesRef: string): string {
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ]
  const [ano, mes] = mesRef.split('-')
  return `${meses[parseInt(mes) - 1]}/${ano}`
}
