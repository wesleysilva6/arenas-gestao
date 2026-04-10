SELECT
    t.nome AS turma,
    mo.nome AS modalidade,
    t.horario::text AS horario,
    (SELECT COUNT(*) FROM aluno_turma at2 WHERE at2.turma_id = t.idturma) AS alunos
FROM turma t
JOIN modalidade mo ON mo.idmodalidade = t.modalidade_id
WHERE t.situacao = 1
  AND LOWER(t.dias_semana) LIKE '%' || LOWER(TO_CHAR(CURRENT_DATE, 'FMDay')) || '%'
ORDER BY t.horario ASC
0