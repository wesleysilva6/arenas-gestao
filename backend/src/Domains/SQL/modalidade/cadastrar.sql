INSERT INTO modalidade (nome, situacao)
VALUES (:nome, :situacao)
RETURNING idmodalidade
