SELECT
    m.idmodalidade,
    m.nome,
    m.situacao,
    m.criado_em,
    (SELECT COUNT(*) FROM aluno a WHERE a.modalidade_id = m.idmodalidade AND a.situacao = 1) AS alunos_count,
    (SELECT COUNT(*) FROM turma t WHERE t.modalidade_id = m.idmodalidade AND t.situacao = 1) AS turmas_count
FROM modalidade m
ORDER BY m.nome ASC
