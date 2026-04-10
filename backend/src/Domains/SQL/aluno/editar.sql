UPDATE aluno SET
    nome = :nome,
    telefone = :telefone,
    modalidade_id = :modalidade_id,
    data_inicio = :data_inicio,
    dia_vencimento = :dia_vencimento,
    notificacao_whatsapp = :notificacao_whatsapp,
    situacao = :situacao,
    observacao = :observacao,
    valor_mensalidade = :valor_mensalidade,
    plano = :plano,
    data_inicio_contrato = :data_inicio_contrato,
    data_vencimento_contrato = :data_vencimento_contrato
WHERE idaluno = :idaluno
