INSERT INTO grupo_whatsapp (nome, link, tipo, referencia_id)
VALUES (:nome, :link, :tipo, :referencia_id)
RETURNING id, nome, link, tipo, referencia_id
