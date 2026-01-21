let exercicioAtual = 0;
let serieAtual = 1;
let cargaAtual = 0;
let descansoAtivo = false;

const indiceAtual = document.getElementById('indice-atual');
const totalExercicios = parseInt(indiceAtual.dataset.total);

const barraProgresso = document.getElementById('barra-progresso');
const nomeExercicio = document.getElementById('nome-exercicio');
const imagemExercicio = document.getElementById('imagem-exercicio');
const descricaoExercicio = document.getElementById('descricao-exercicio');

const serieTexto = document.getElementById('serie-atual');
const repsInfo = document.getElementById('reps-info');
const valorCarga = document.getElementById('valor-carga');

const btnDescanso = document.getElementById('btn-descanso');
const progressoDescanso = btnDescanso.querySelector('.progresso');
const textoDescanso = btnDescanso.querySelector('.texto');

const STORAGE_KEY = 'coreon_execucao';

const STORAGE_CARGAS = 'coreon_cargas';

function carregarCargas() {
  return JSON.parse(localStorage.getItem(STORAGE_CARGAS) || '{}');
}

function salvarCargas(cargas) {
  localStorage.setItem(STORAGE_CARGAS, JSON.stringify(cargas));
}

/* ===== LOAD / SAVE ===== */
function salvarEstado() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    exercicioAtual,
    serieAtual,
    cargaAtual
  }));
}

function carregarEstado() {
  const salvo = localStorage.getItem(STORAGE_KEY);
  if (!salvo) return;
  const estado = JSON.parse(salvo);
  exercicioAtual = estado.exercicioAtual;
  serieAtual = estado.serieAtual;
  cargaAtual = estado.cargaAtual;
}

/* ===== RENDER ===== */
function renderExercicio() {
  const ex = TREINO[exercicioAtual];

  nomeExercicio.textContent = ex.nome;
  imagemExercicio.src = `/static/imagens/exercicios/${ex.imagem}`;
  descricaoExercicio.textContent = ex.descricao;

  const cargasSalvas = carregarCargas();
  cargaAtual = cargasSalvas[ex.id] || 0;

  serieTexto.textContent = `Série ${serieAtual}`;

  if (ex.metrica_execucao === 'repeticoes') {
    repsInfo.textContent = `Reps: ${ex.reps}`;
  } else {
    repsInfo.textContent = `Tempo: ${ex.tempo}`;
  }

  valorCarga.textContent = `${cargaAtual} kg`;

  indiceAtual.textContent = exercicioAtual + 1;
  barraProgresso.style.width =
    `${((exercicioAtual + 1) / totalExercicios) * 100}%`;

  salvarEstado();
}

function renderMidia(ex) {
  const container = document.querySelector('.media-exercicio');

  if (ex.video) {
    container.innerHTML = `
      <video class="media" autoplay muted loop playsinline>
        <source src="/static/videos/exercicios/${ex.video}">
      </video>
    `;
  } else if (ex.imagem) {
    container.innerHTML = `
      <img class="media" src="/static/imagens/exercicios/${ex.imagem}">
    `;
  } else if (ex.imagem_d) {
    container.innerHTML = `
      <img class="media" src="/static/imagens/exercicios/${ex.imagem_d}">
    `;
  }
}

/* ===== CARGA ===== */
function alterarCarga(delta) {
  cargaAtual = Math.max(0, cargaAtual + delta);
  valorCarga.textContent = `${cargaAtual} kg`;
  salvarEstado();
}

/* ===== DESCANSO ===== */
btnDescanso.addEventListener('click', () => {
  if (descansoAtivo) return;

  descansoAtivo = true;
  let tempo = 45;

  progressoDescanso.style.width = '0%';
  textoDescanso.textContent = `${tempo}s`;

  const timer = setInterval(() => {
    tempo--;

    progressoDescanso.style.width =
      `${((45 - tempo) / 45) * 100}%`;

    textoDescanso.textContent = `${tempo}s`;

    if (tempo <= 0) {
      clearInterval(timer);
      progressoDescanso.style.width = '0%';
      textoDescanso.textContent = 'Iniciar descanso (45s)';
      descansoAtivo = false;

      avancarSerie();
    }
  }, 1000);
});

/* ===== AVANÇO ===== */
function avancarSerie() {
  const ex = TREINO[exercicioAtual];
  const box = document.getElementById('serie-box');

  box.classList.add('concluida');

  setTimeout(() => {
    box.classList.remove('concluida');

    if (serieAtual < ex.series) {
      serieAtual++;
      serieTexto.textContent = `Série ${serieAtual}`;
      salvarEstado();
    } else {
      avancarExercicio();
    }
  }, 400);
}

function avancarExercicio() {
  const cargas = carregarCargas();
  const ex = TREINO[exercicioAtual];

  cargas[ex.id] = cargaAtual;
  salvarCargas(cargas);

  exercicioAtual++;
  serieAtual = 1;
  cargaAtual = 0;

  if (exercicioAtual >= TREINO.length) {
    finalizarTreino();
    return;
  }

  renderExercicio();
}

/* ===== FINAL ===== */
function finalizarTreino() {
  salvarHistoricoTreino();
  localStorage.removeItem(STORAGE_KEY);
  window.location.href = '/resumo';
}

function salvarHistoricoTreino() {
  const historico = JSON.parse(
    localStorage.getItem('coreon_historico') || '[]'
  );

  const agora = new Date();

  historico.push({
    data: agora.toISOString(),
    treino: document.querySelector('.execucao-header h1').textContent,
    exercicios: TREINO.length,
    duracao_min: TREINO.length * 3 // estimativa simples
  });

  localStorage.setItem(
    'coreon_historico',
    JSON.stringify(historico)
  );
}


/* ===== INIT ===== */
carregarEstado();
renderExercicio();
