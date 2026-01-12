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

/* ===== RENDER ===== */
function renderExercicio() {
    const ex = TREINO[exercicioAtual];

    nomeExercicio.textContent = ex.nome;
    imagemExercicio.src = `/static/imagens/exercicios/${ex.imagem}`;
    descricaoExercicio.textContent = ex.descricao;

    serieAtual = 1;
    serieTexto.textContent = `Série 1`;

    if (ex.metrica_execucao === 'repeticoes') {
        repsInfo.textContent = `Reps: ${ex.reps}`;
    } else {
        repsInfo.textContent = `Tempo: ${ex.tempo}`;
    }

    cargaAtual = 0;
    valorCarga.textContent = '0 kg';

    indiceAtual.textContent = exercicioAtual + 1;
    barraProgresso.style.width =
        `${((exercicioAtual + 1) / totalExercicios) * 100}%`;
}

/* ===== CARGA ===== */
function alterarCarga(delta) {
    cargaAtual = Math.max(0, cargaAtual + delta);
    valorCarga.textContent = `${cargaAtual} kg`;
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

            serieAtual++;
            serieTexto.textContent = `Série ${serieAtual}`;
        }
    }, 1000);
});

/* ===== CONCLUIR EXERCÍCIO ===== */
function concluirExercicio() {
    if (exercicioAtual < TREINO.length - 1) {
        exercicioAtual++;
        renderExercicio();
    } else {
        alert('🎉 Treino finalizado!');
        window.location.href = '/';
    }
}

/* INIT */
window.addEventListener('load', renderExercicio);
