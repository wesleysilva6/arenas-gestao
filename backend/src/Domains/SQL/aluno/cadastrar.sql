INSERT INTO aluno (
    nome,
    telefone,
    cpf,
    data_nascimento,
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
    :cpf,
    :data_nascimento,
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
