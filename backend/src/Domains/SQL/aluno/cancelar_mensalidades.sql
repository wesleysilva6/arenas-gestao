UPDATE mensalidade SET situacao = 2
WHERE aluno_id = :aluno_id
  AND situacao = 0
