INSERT INTO aluno (
    nome,
    telefone,
    modalidade_id,
    data_inicio,
    dia_vencimento,
    notificacao_whatsapp,
    situacao,
    observacao,
    valor_mensalidade,
    plano,
    data_inicio_contrato,
    data_vencimento_contrato
) VALUES (
    :nome,
    :telefone,
    :modalidade_id,
    :data_inicio,
    :dia_vencimento,
    :notificacao_whatsapp,
    :situacao,
    :observacao,
    :valor_mensalidade,
    :plano,
    :data_inicio_contrato,
    :data_vencimento_contrato
)
RETURNING idaluno
