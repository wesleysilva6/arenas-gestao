import { useState, useCallback } from 'react'
import { Box, Flex, useToast } from '@chakra-ui/react'

import { useAuth } from '../../contexts/AuthContext'
import {
  atualizarDados,
  verificarSenha,
  alterarSenha,
} from '../../service/usuario'

import PerfilHeader from './components/PerfilHeader'
import DadosPessoaisCard from './components/DadosPessoaisCard'
import SegurancaCard from './components/SegurancaCard'

export default function ConfiguracoesPage() {
  const { user } = useAuth()
  const toast = useToast()

  const userName = user?.nome ?? ''
  const userEmail = user?.email ?? ''

  // — Dados pessoais —
  const [nome, setNome] = useState(userName)
  const [email, setEmail] = useState(userEmail)
  const [savingDados, setSavingDados] = useState(false)

  // — Senha —
  const [senhaVerificada, setSenhaVerificada] = useState(false)
  const [verificando, setVerificando] = useState(false)
  const [alterandoSenha, setAlterandoSenha] = useState(false)

  const dadosMudaram =
    nome.trim() !== userName ||
    email.trim().toLowerCase() !== userEmail.toLowerCase()

  // ── Salvar nome e email ───────────────────────────────────────────────────
  const handleSalvarDados = useCallback(async () => {
    if (nome.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return

    setSavingDados(true)
    try {
      await atualizarDados(nome.trim(), email.trim())

      toast({
        title: 'Dados atualizados com sucesso',
        status: 'success',
        duration: 3000,
        position: 'top',
      })
    } catch (err: any) {
      toast({
        title: 'Erro ao atualizar dados',
        description: err?.response?.data?.error || err.message,
        status: 'error',
        duration: 4000,
        position: 'top',
      })
    } finally {
      setSavingDados(false)
    }
  }, [nome, email, toast])

  // ── Verificar senha atual ─────────────────────────────────────────────────
  const handleVerificarSenha = useCallback(
    async (senhaAtual: string) => {
      if (!senhaAtual) return
      setVerificando(true)
      try {
        await verificarSenha(senhaAtual)
        setSenhaVerificada(true)
        toast({
          title: 'Senha verificada',
          description: 'Agora você pode definir uma nova senha.',
          status: 'success',
          duration: 3000,
          position: 'top',
        })
      } catch {
        toast({
          title: 'Senha incorreta',
          description: 'A senha atual informada não está correta.',
          status: 'error',
          duration: 4000,
          position: 'top',
        })
      } finally {
        setVerificando(false)
      }
    },
    [toast],
  )

  // ── Alterar senha ─────────────────────────────────────────────────────────
  const handleAlterarSenha = useCallback(
    async (senhaAtual: string, novaSenha: string) => {
      setAlterandoSenha(true)
      try {
        await alterarSenha(senhaAtual, novaSenha)
        setSenhaVerificada(false)
        toast({
          title: 'Senha alterada com sucesso',
          status: 'success',
          duration: 3000,
          position: 'top',
        })
      } catch (err: any) {
        toast({
          title: 'Erro ao alterar senha',
          description: err?.response?.data?.error || err.message,
          status: 'error',
          duration: 4000,
          position: 'top',
        })
      } finally {
        setAlterandoSenha(false)
      }
    },
    [toast],
  )

  return (
    <Box p={{ base: 4, md: 6, lg: 8 }} maxW="900px" w="full" mx="auto">

      {/* Cabeçalho do perfil */}
      <PerfilHeader nome={userName} email={userEmail} />

      {/* Grid: Dados + Segurança */}
      <Flex gap={5} direction={{ base: 'column', lg: 'row' }} align="flex-start">
        <DadosPessoaisCard
          nome={nome}
          email={email}
          onNomeChange={setNome}
          onEmailChange={setEmail}
          dadosMudaram={dadosMudaram}
          saving={savingDados}
          onSalvar={handleSalvarDados}
        />

        <SegurancaCard
          senhaVerificada={senhaVerificada}
          verificando={verificando}
          alterandoSenha={alterandoSenha}
          onVerificarSenha={handleVerificarSenha}
          onAlterarSenha={handleAlterarSenha}
          onResetVerificacao={() => setSenhaVerificada(false)}
        />
      </Flex>
    </Box>
  )
}
