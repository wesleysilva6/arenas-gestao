SELECT
  g.idgasto,
  g.descricao,
  g.valor,
  g.categoria,
  g.data,
  g.observacao,
  g.criado_em
FROM gasto g
ORDER BY g.data DESC, g.criado_em DESC