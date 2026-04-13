export function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR')
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// ── CPF ──

/** Remove tudo que não é dígito */
function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

/** Aplica máscara de CPF ao digitar: 000.000.000-00 */
export function maskCPF(value: string): string {
  const digits = onlyDigits(value).slice(0, 11)
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

/** Formata CPF para exibição (aceita string com ou sem máscara) */
export function formatCPF(cpf: string | null | undefined): string {
  if (!cpf) return '—'
  const digits = onlyDigits(cpf)
  if (digits.length !== 11) return cpf // retorna como está se inválido
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

/** Remove máscara do CPF para enviar ao backend */
export function unmaskCPF(cpf: string): string {
  return onlyDigits(cpf)
}

// ── Telefone ──

/** Aplica máscara de telefone ao digitar: (00) 00000-0000 */
export function maskPhone(value: string): string {
  const digits = onlyDigits(value).slice(0, 11)
  if (digits.length <= 2) return digits.length ? `(${digits}` : ''
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

/** Formata telefone para exibição */
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return '—'
  const digits = onlyDigits(phone)
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return phone // retorna como está se não bater
}

/** Remove máscara do telefone para enviar ao backend */
export function unmaskPhone(phone: string): string {
  return onlyDigits(phone)
}

// ── Valor monetário (input) ──

/** Aplica máscara de valor monetário ao digitar: 1.234,56 */
export function maskCurrency(value: string): string {
  let digits = onlyDigits(value)
  if (!digits) return ''
  // Remove zeros à esquerda (mantém pelo menos 1)
  digits = digits.replace(/^0+(\d)/, '$1')
  // Garante pelo menos 3 dígitos para ter centavos
  digits = digits.padStart(3, '0')
  const intPart = digits.slice(0, -2)
  const decPart = digits.slice(-2)
  // Adiciona pontos de milhar
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${formatted},${decPart}`
}

/** Converte valor mascarado para number */
export function unmaskCurrency(value: string): number {
  if (!value) return 0
  const cleaned = value.replace(/\./g, '').replace(',', '.')
  return parseFloat(cleaned) || 0
}