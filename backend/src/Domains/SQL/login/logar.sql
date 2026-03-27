SELECT 
    idusuario,
    nome,
    email,
    senha_hash,
    situacao
FROM usuario 
WHERE email = :email
  AND situacao = 1
LIMIT 1
