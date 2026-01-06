const cards = document.querySelectorAll('.card-exercicio');
const carrossel = document.querySelector('.carrossel');
const indicador = document.getElementById('indice-atual');

let exercicioAtual = 0;
let descansoAtivo = false;
let timer = null;

/* ===== RENDER ===== */
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

/* ===== CONCLUIR ===== */
function concluirExercicio() {
    if (descansoAtivo) return;

    if (exercicioAtual < cards.length - 1) {
        exercicioAtual++;
        render();
    } else {
        alert('🎉 Treino finalizado!');
        window.location.href = '/';
    }
}

/* ===== DESCANSO ===== */
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

/* ===== CARGA ===== */
function chaveCarga() {
    return `carga_ex_${cards[exercicioAtual].dataset.exId}`;
}

function atualizarCarga() {
    const span = cards[exercicioAtual].querySelector('.valor-carga');
    span.textContent = `${localStorage.getItem(chaveCarga()) || 0} kg`;
}

function alterarCarga(delta) {
    let v = parseInt(localStorage.getItem(chaveCarga()) || 0);
    v = Math.max(0, v + delta);
    localStorage.setItem(chaveCarga(), v);
    atualizarCarga();
}

/* ===== INIT ===== */
window.addEventListener('load', render);
