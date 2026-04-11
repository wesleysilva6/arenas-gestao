UPDATE mensalidade
SET situacao = 1,
    data_pagamento = CURRENT_DATE
WHERE idmensalidade = :idmensalidade
RETURNING idmensalidade
