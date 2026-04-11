SELECT
    t.idturma,
    t.nome,
    t.modalidade_id,
    t.dias_semana,
    t.horario,
    t.professor,
    t.limite_alunos,
    t.situacao,
    t.criado_em,
    m.nome AS modalidade_nome,
    (SELECT COUNT(*) FROM aluno_turma at2 WHERE at2.turma_id = t.idturma) AS alunos_count
FROM turma t
LEFT JOIN modalidade m ON m.idmodalidade = t.modalidade_id
ORDER BY t.nome ASC
