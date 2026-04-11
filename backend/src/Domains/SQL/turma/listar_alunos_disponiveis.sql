SELECT
    a.idaluno,
    a.nome,
    a.telefone,
    a.situacao
FROM aluno a
WHERE a.situacao = 1
  AND NOT EXISTS (
      SELECT 1 FROM aluno_turma at2
      WHERE at2.aluno_id = a.idaluno
        AND at2.turma_id = :turma_id
  )
ORDER BY a.nome ASC
