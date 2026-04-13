SELECT idusuario, nome, email, situacao
FROM usuario
WHERE idusuario = :idusuario AND situacao = 1
LIMIT 1