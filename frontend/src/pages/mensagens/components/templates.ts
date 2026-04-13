export type TipoEnvio = 'aluno' | 'turma' | 'modalidade' | 'todos' | 'grupo'

export interface TemplateItem {
  titulo: string
  texto: string
  contextos: TipoEnvio[]
}

export interface TemplateCategoria {
  categoria: string
  cor: string
  itens: TemplateItem[]
}

const GRUPO_CONTEXTOS: TipoEnvio[] = ['turma', 'todos', 'grupo']
const MODALIDADE_CONTEXTOS: TipoEnvio[] = ['modalidade']

export const TEMPLATES: TemplateCategoria[] = [
  {
    categoria: 'Mensalidades',
    cor: 'orange',
    itens: [
      {
        titulo: 'Mensalidade a vencer',
        contextos: ['aluno'],
        texto: 'Olá, {nome}! 👋\n\nPassamos para lembrá-lo(a) que sua mensalidade vence em breve.\n\n💰 Valor: R$ {valor}\n📅 Vencimento: {vencimento}\n\nQualquer dúvida, é só chamar. Obrigado! 🙏',
      },
      {
        titulo: 'Mensalidade vencida',
        contextos: ['aluno'],
        texto: 'Olá, {nome}! 👋\n\nIdentificamos que sua mensalidade está em aberto.\n\n💰 Valor: R$ {valor}\n📅 Vencimento: {vencimento}\n\nPor favor, regularize para não ter sua vaga comprometida. Qualquer dúvida, estamos à disposição! 💚',
      },
      {
        titulo: 'Confirmação de pagamento',
        contextos: ['aluno'],
        texto: 'Olá, {nome}! ✅\n\nSeu pagamento foi confirmado com sucesso. Obrigado!\n\nEstamos te esperando nos treinos. Bora! 💪',
      },
    ],
  },
  {
    categoria: 'Treinos',
    cor: 'blue',
    itens: [
      {
        titulo: 'Alteração de horário',
        contextos: GRUPO_CONTEXTOS,
        texto: 'Atenção, turma! ⏰\n\nInformamos que o horário do treino foi alterado:\n\n🕐 Novo horário: {horario}\n📅 A partir de: {data}\n\nQualquer dúvida, fale com a gente. Abraços! 🙌',
      },
      {
        titulo: 'Treino cancelado',
        contextos: GRUPO_CONTEXTOS,
        texto: 'Atenção, turma! ❌\n\nO treino de hoje ({data}) está *cancelado*.\n\nMotivo: {motivo}\n\nRemarcaremos em breve. Pedimos desculpas pelo transtorno! 🙏',
      },
      {
        titulo: 'Falta de aluno',
        contextos: ['aluno'],
        texto: 'Olá, {nome}! 👋\n\nSentimos sua falta no treino de hoje! Esperamos que esteja tudo bem.\n\nSempre que precisar, é só avisar. Te esperamos na próxima aula! 💪',
      },
      {
        titulo: 'Lembrete de treino',
        contextos: ['aluno'],
        texto: 'Olá, {nome}! 🏋️\n\nLembrando que você tem treino hoje!\n\n🕐 Horário: {horario}\n\nNos vemos lá! 💪',
      },
      {
        titulo: 'Lembrete de treino (turma)',
        contextos: GRUPO_CONTEXTOS,
        texto: 'Atenção, turma! 🏋️\n\nLembrando que temos treino hoje!\n\n🕐 Horário: {horario}\n\nNos vemos lá! 💪',
      },
    ],
  },
  {
    categoria: 'Comunicados',
    cor: 'purple',
    itens: [
      {
        titulo: 'Boas-vindas novo aluno',
        contextos: ['aluno'],
        texto: 'Bem-vindo(a), {nome}! 🎉\n\nÉ uma alegria tê-lo(a) em nossa equipe!\n\n📅 Seu primeiro treino será: {data}\n🕐 Horário: {horario}\n\nQualquer dúvida, pode chamar. Bora arrasar! 🚀',
      },
      {
        titulo: 'Aniversário do aluno',
        contextos: ['aluno'],
        texto: 'Feliz aniversário, {nome}! 🎂🎉\n\nA equipe toda deseja um dia incrível e muita saúde!\n\nContinue arrasando nos treinos! 💪🏆',
      },
      {
        titulo: 'Renovação de contrato',
        contextos: ['aluno'],
        texto: 'Olá, {nome}! 📋\n\nSeu contrato vence em {fim_contrato}. Gostaríamos de contar com você por mais tempo!\n\nEntre em contato para renovar e garantir sua vaga. Temos ótimas condições! 💚',
      },
      {
        titulo: 'Feriado / sem treino',
        contextos: GRUPO_CONTEXTOS,
        texto: 'Atenção! 📢\n\nNão haverá treino no dia {data} devido ao feriado de {feriado}.\n\nOs treinos retornam normalmente em {retorno}.\n\nAproveite o descanso! 😊',
      },
      {
        titulo: 'Evento / competição',
        contextos: [...GRUPO_CONTEXTOS, ...MODALIDADE_CONTEXTOS],
        texto: 'Atenção! 🏆\n\nTemos um evento especial se aproximando!\n\n📅 Data: {data}\n🕐 Horário: {horario}\n📍 Local: {local}\n\nMais detalhes em breve. Fiquem ligados! 🎯',
      },
    ],
  },
]

export const inputStyle = {
  bg: 'gray.50',
  border: '1px solid',
  borderColor: 'gray.200',
  rounded: 'xl',
  fontSize: 'sm' as const,
  _focus: {
    bg: 'white',
    borderColor: 'brand.400',
    boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)',
  },
}
