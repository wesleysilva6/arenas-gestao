UPDATE presenca
SET situacao = :situacao
WHERE idpresenca = :idpresenca
RETURNING idpresenca, situacao
