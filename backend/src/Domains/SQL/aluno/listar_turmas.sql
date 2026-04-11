SELECT
    t.idturma,
    t.nome,
    t.horario,
    t.dias_semana,
    t.professor,
    m.nome AS modalidade_nome
FROM turma t
INNER JOIN modalidade m ON t.modalidade_id = m.idmodalidade
INNER JOIN aluno_turma atu ON atu.turma_id = t.idturma
WHERE atu.aluno_id = :idaluno
ORDER BY m.nome, t.nome
