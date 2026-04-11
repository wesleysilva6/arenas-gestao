UPDATE grupo_whatsapp
SET nome = :nome,
    link = :link,
    tipo = :tipo,
    referencia_id = :referencia_id
WHERE id = :id
RETURNING id, nome, link, tipo, referencia_id
