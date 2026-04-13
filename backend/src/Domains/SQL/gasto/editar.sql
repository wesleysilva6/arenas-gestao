UPDATE gasto
SET descricao = :descricao,
    valor = :valor,
    categoria = :categoria,
    data = :data,
    observacao = :observacao
WHERE idgasto = :idgasto
RETURNING idgasto, descricao, valor, categoria, data, observacao, criado_em