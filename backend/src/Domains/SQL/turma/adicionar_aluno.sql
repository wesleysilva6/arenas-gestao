INSERT INTO aluno_turma (aluno_id, turma_id)
VALUES (:aluno_id, :turma_id)
ON CONFLICT (aluno_id, turma_id) DO NOTHING
