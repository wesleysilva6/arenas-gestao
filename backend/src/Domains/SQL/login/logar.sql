SELECT 
    idusuario,
    nome,
    email,
    senha,
    situacao
FROM usuario 
WHERE email = :email
  AND situacao = 1
LIMIT 1
