INSERT INTO mensalidade (aluno_id, valor, mes_referencia, data_vencimento, situacao)
VALUES (:aluno_id, :valor, :mes_referencia, :data_vencimento, 0)
ON CONFLICT (aluno_id, mes_referencia) DO NOTHING
