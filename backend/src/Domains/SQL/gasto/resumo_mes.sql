SELECT
  categoria,
  SUM(valor) AS total,
  COUNT(*) AS quantidade
FROM gasto
WHERE TO_CHAR(data, 'YYYY-MM') = :mes_referencia
GROUP BY categoria
ORDER BY total DESC