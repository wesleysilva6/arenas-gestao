SELECT
    a.idaluno,
    a.nome,
    a.telefone,
    a.situacao
FROM aluno_turma at2
JOIN aluno a ON a.idaluno = at2.aluno_id
WHERE at2.turma_id = :turma_id
ORDER BY a.nome ASC
