UPDATE turma
SET
    nome          = :nome,
    modalidade_id = :modalidade_id,
    dias_semana   = :dias_semana,
    horario       = :horario,
    professor     = :professor,
    limite_alunos = :limite_alunos,
    situacao      = :situacao
WHERE idturma = :idturma
RETURNING idturma
