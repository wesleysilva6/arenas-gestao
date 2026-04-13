INSERT INTO gasto (descricao, valor, categoria, data, observacao)
VALUES (:descricao, :valor, :categoria, :data, :observacao)
RETURNING idgasto, descricao, valor, categoria, data, observacao, criado_em