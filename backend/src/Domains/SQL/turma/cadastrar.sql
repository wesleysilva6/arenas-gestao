INSERT INTO turma (nome, modalidade_id, dias_semana, horario, professor, limite_alunos, situacao)
VALUES (:nome, :modalidade_id, :dias_semana, :horario, :professor, :limite_alunos, :situacao)
RETURNING idturma
