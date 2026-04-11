SELECT
    mn.idmensalidade,
    mn.aluno_id,
    mn.valor,
    mn.mes_referencia,
    mn.data_vencimento,
    mn.data_pagamento,
    mn.situacao,
    mn.criado_em,
    a.nome AS aluno_nome,
    a.telefone AS aluno_telefone
FROM mensalidade mn
INNER JOIN aluno a ON a.idaluno = mn.aluno_id
ORDER BY mn.data_vencimento DESC
