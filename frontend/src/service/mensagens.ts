import http from './http'

// ── Interfaces ──

export interface GrupoWhatsApp {
  id: number
  nome: string
  link: string
  tipo: 'turma' | 'modalidade' | 'geral'
  referencia_id: number | null
  criado_em: string
}

export interface MensagemLog {
  idmensagem: number
  tipo: string
  destino: string | null
  mensagem: string
  enviado_em: string
}

export interface AlunoTurmaMap {
  aluno_id: number
  turma_id: number
}

export interface AlunoMsg {
  idaluno: number
  nome: string
  telefone: string
  modalidade_id: number
  modalidade_nome: string
  situacao: number
}

export interface TurmaMsg {
  idturma: number
  nome: string
  modalidade_nome: string
  situacao: number
}

export interface ModalidadeMsg {
  idmodalidade: number
  nome: string
}

// ── Carregamento de dados ──

export async function carregarDadosMensagens() {
  const [alunosRes, turmasRes, modalidadesRes, mapaRes, gruposRes, historicoRes] =
    await Promise.all([
      http.get('/alunos'),
      http.get('/turmas'),
      http.get('/alunos/modalidades'),
      http.get('/mensagens/alunos-turma-map'),
      http.get('/grupos-whatsapp'),
      http.get('/mensagens/historico'),
    ])

  const alunosRaw = alunosRes.data?.data ?? alunosRes.data ?? []
  const turmasRaw = turmasRes.data?.data ?? turmasRes.data ?? []

  return {
    alunos: (alunosRaw as AlunoMsg[]).filter((a) => a.situacao === 1),
    turmas: (turmasRaw as TurmaMsg[]).filter((t) => t.situacao === 1),
    modalidades: (modalidadesRes.data ?? []) as ModalidadeMsg[],
    alunosTurmaMap: (mapaRes.data ?? []) as AlunoTurmaMap[],
    grupos: (gruposRes.data ?? []) as GrupoWhatsApp[],
    historico: (historicoRes.data ?? []) as MensagemLog[],
  }
}

// ── Grupos WhatsApp ──

export async function cadastrarGrupo(dados: Partial<GrupoWhatsApp>): Promise<void> {
  await http.post('/grupos-whatsapp', dados)
}

export async function editarGrupo(id: number, dados: Partial<GrupoWhatsApp>): Promise<void> {
  await http.put(`/grupos-whatsapp/${id}`, dados)
}

export async function deletarGrupo(id: number): Promise<void> {
  await http.delete(`/grupos-whatsapp/${id}`)
}

// ── Mensagens ──

export async function registrarMensagem(dados: { tipo: string; destino: string; mensagem: string }): Promise<void> {
  await http.post('/mensagens', dados)
}

// ── Helpers WhatsApp ──

export function normalizeTelefone(tel: string): string {
  const digits = tel.replace(/\D/g, '')
  return digits.startsWith('55') ? digits : `55${digits}`
}

export function openWhatsApp(phone: string, message: string): void {
  window.open(
    `https://wa.me/${normalizeTelefone(phone)}?text=${encodeURIComponent(message)}`,
    '_blank',
  )
}

export function openGrupoLink(link: string): void {
  const url = link.startsWith('http') ? link : `https://chat.whatsapp.com/${link}`
  window.open(url, '_blank')
}
