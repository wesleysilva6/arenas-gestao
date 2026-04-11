INSERT INTO mensagem (tipo, destino, mensagem)
VALUES (:tipo, :destino, :mensagem)
RETURNING idmensagem
