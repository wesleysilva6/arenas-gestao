DELETE FROM mensalidade
WHERE aluno_id = :aluno_id
  AND situacao = 0
