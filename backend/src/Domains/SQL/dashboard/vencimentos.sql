SELECT
    a.nome AS aluno,
    m.data_vencimento AS vencimento,
    m.valor,
    m.situacao
FROM mensalidade m
JOIN aluno a ON a.idaluno = m.aluno_id
WHERE m.situacao IN (0, 2)
  AND m.data_vencimento <= CURRENT_DATE + INTERVAL '30 days'
ORDER BY m.data_vencimento ASC
LIMIT 10
