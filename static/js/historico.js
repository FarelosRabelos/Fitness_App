const lista = document.getElementById('lista-historico');
const vazio = document.getElementById('vazio');

const historico = JSON.parse(
  localStorage.getItem('coreon_historico') || '[]'
);

if (historico.length === 0) {
  vazio.style.display = 'block';
} else {
  vazio.style.display = 'none';

  historico.reverse().forEach(item => {
    const li = document.createElement('li');
    li.className = 'item';

    const data = new Date(item.data).toLocaleDateString('pt-BR');

    li.innerHTML = `
      <strong>${item.treino}</strong>
      <span>${data}</span>
      <small>${item.exercicios} exercícios · ${item.duracao_min} min</small>
    `;

    lista.appendChild(li);
  });
}
