<?php

namespace App\Domains\Services;

use App\Domains\Repositories\MensalidadeRepository;

class MensalidadeService
{
    public static function listar(): array
    {
        return MensalidadeRepository::listar();
    }

    public static function confirmarPagamento(int $idmensalidade): array
    {
        return MensalidadeRepository::confirmarPagamento($idmensalidade);
    }

    public static function gerarMesAtual(string $mesReferencia, int $ano, int $mes): array
    {
        $alunos = MensalidadeRepository::alunosSemMensalidade($mesReferencia);

        if (empty($alunos)) {
            return ['geradas' => 0];
        }

        $geradas = 0;
        foreach ($alunos as $aluno) {
            $ultimoDia = cal_days_in_month(CAL_GREGORIAN, $mes, $ano);
            $dia = min((int) $aluno['dia_vencimento'], $ultimoDia);
            $dataVencimento = sprintf('%04d-%02d-%02d', $ano, $mes, $dia);

            MensalidadeRepository::gerarMensalidade([
                'aluno_id'       => (int) $aluno['idaluno'],
                'valor'          => (float) ($aluno['valor_mensalidade'] ?? 0),
                'mes_referencia' => $mesReferencia,
                'data_vencimento' => $dataVencimento,
            ]);
            $geradas++;
        }

        return ['geradas' => $geradas];
    }

    public static function contarSemMensalidade(string $mesReferencia): int
    {
        $alunos = MensalidadeRepository::alunosSemMensalidade($mesReferencia);
        return count($alunos);
    }
}
