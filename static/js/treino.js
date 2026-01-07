/* =========================
   SELETORES
========================= */
const cards = document.querySelectorAll('.card-exercicio');
const carrossel = document.querySelector('.carrossel');
const indicador = document.getElementById('indice-atual');

/* =========================
   ESTADO
========================= */
let exercicioAtual = 0;
let descansoAtivo = false;
let timer = null;

/* =========================
   RENDER
========================= */
function render() {
    carrossel.style.transform = `translateX(-${exercicioAtual * 100}%)`;
    indicador.textContent = exercicioAtual + 1;

    const btn = cards[exercicioAtual].querySelector('.btn-concluir');
    btn.textContent =
        exercicioAtual === cards.length - 1
            ? 'Finalizar treino'
            : 'Concluir exercício';

    atualizarCarga();
}

/* =========================
   CONCLUIR EXERCÍCIO / TREINO
========================= */
function concluirExercicio() {
    if (descansoAtivo) return;

    if (exercicioAtual < cards.length - 1) {
        exercicioAtual++;
        render();
    } else {
        alert('🎉 Treino finalizado!');
        concluirTreinoHoje(); // 🔥 MARCA O DIA COMO FEITO
    }
}

/* =========================
   MARCAR TREINO DO DIA
========================= */
function concluirTreinoHoje() {
    const hoje = new Date().getDay(); // 0 = domingo
    const indiceHoje = hoje === 0 ? 6 : hoje - 1;

    localStorage.setItem('treino-' + indiceHoje, 'feito');

    // Redireciona para a home
    window.location.href = '/';
}

/* =========================
   DESCANSO
========================= */
function iniciarDescanso(botao) {
    if (timer) return;

    descansoAtivo = true;

    const btnConcluir = cards[exercicioAtual].querySelector('.btn-concluir');
    btnConcluir.classList.add('bloqueado');

    const texto = botao.querySelector('.texto');
    const progresso = botao.querySelector('.progresso');

    let tempo = 45;
    texto.textContent = `${tempo}s`;

    timer = setInterval(() => {
        tempo--;
        progresso.style.width = `${((45 - tempo) / 45) * 100}%`;
        texto.textContent = `${tempo}s`;

        if (tempo <= 0) {
            clearInterval(timer);
            timer = null;
            descansoAtivo = false;

            progresso.style.width = '0%';
            texto.textContent = 'Iniciar descanso (45s)';
            btnConcluir.classList.remove('bloqueado');
        }
    }, 1000);
}

/* =========================
   CARGA
========================= */
function chaveCarga() {
    return `carga_ex_${cards[exercicioAtual].dataset.exId}`;
}

function atualizarCarga() {
    const span = cards[exercicioAtual].querySelector('.valor-carga');
    span.textContent = `${localStorage.getItem(chaveCarga()) || 0} kg`;
}

function alterarCarga(delta) {
    let valor = parseInt(localStorage.getItem(chaveCarga()) || 0);
    valor = Math.max(0, valor + delta);
    localStorage.setItem(chaveCarga(), valor);
    atualizarCarga();
}

/* =========================
   INIT
========================= */
window.addEventListener('load', render);
