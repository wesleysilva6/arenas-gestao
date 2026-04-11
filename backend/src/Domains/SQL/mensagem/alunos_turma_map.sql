SELECT atu.aluno_id, atu.turma_id
FROM aluno_turma atu
JOIN aluno a ON a.idaluno = atu.aluno_id AND a.situacao = 1
