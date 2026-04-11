SELECT idmensagem, tipo, destino, mensagem, enviado_em
FROM mensagem
ORDER BY enviado_em DESC
LIMIT 50
