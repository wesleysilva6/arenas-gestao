SELECT
    a.idaluno,
    a.nome,
    a.telefone,
    a.modalidade_id,
    m.nome AS modalidade_nome,
    a.data_inicio,
    a.dia_vencimento,
    a.notificacao_whatsapp,
    a.situacao,
    a.observacao,
    a.criado_em,
    a.valor_mensalidade,
    a.plano,
    a.data_inicio_contrato,
    a.data_vencimento_contrato
FROM aluno a
JOIN modalidade m ON m.idmodalidade = a.modalidade_id
ORDER BY a.nome ASC
