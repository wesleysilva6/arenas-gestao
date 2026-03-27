import Swal from 'sweetalert2';

export function showSuccess(message?: string) {
  Swal.fire({
    title: "Sucesso!",
    text: message || "Operação realizada com sucesso.",
    icon: "success",
    timer: 5000,
    timerProgressBar: true,
    confirmButtonText: "OK",
    background: "#ddffdbff",
    color: "#1f5c1f",
    iconColor: "#6cc16c",
    confirmButtonColor: "#4caf50",
  });
}

export function showError(message?: string) {
  Swal.fire({
    title: "Erro!",
    text: message || "Ocorreu um erro.",
    icon: "error",
    timer: 5000,
    timerProgressBar: true,
    confirmButtonText: "OK",
    background: "#ffeaea",
    color: "#8b0000",
    iconColor: "#ff5c5c",
    confirmButtonColor: "#d33",
    customClass: { container: 'swal-top-layer' },
  });
}

export function showConfirm(message?: string) {
  return Swal.fire({
    title: "Confirmação",
    text: message || "Deseja atualizar os dados?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sim",
    cancelButtonText: "Não",
    reverseButtons: true,
    backdrop: true,
    allowOutsideClick: false,
    allowEscapeKey: true,
    background: "#FFF9DB",
    color: "#2D3748",
    iconColor: "#D69E2E",
    confirmButtonColor: "#4caf50",
    cancelButtonColor: "#d33",
  });
}