const historico = JSON.parse(
  localStorage.getItem('coreon_historico') || '[]'
);

const ultimo = historico[historico.length - 1];

if (ultimo) {
  document.getElementById('treino-nome').textContent = ultimo.treino;
  document.getElementById('qtd-exercicios').textContent = ultimo.exercicios;
  document.getElementById('duracao').textContent = `${ultimo.duracao_min} min`;

  const data = new Date(ultimo.data).toLocaleDateString('pt-BR');
  document.getElementById('treino-data').textContent = data;
}
