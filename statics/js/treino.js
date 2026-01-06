const treinoEstado = {
    exercicioAtual: 0,
    totalExercicios: 0
};

let timerAtivo = null;

function renderizarEstado() {
    const cards = document.querySelectorAll('.card-exercicio');
    const carrossel = document.querySelector('.carrossel');

    if (!cards.length) return;

    cards.forEach((card, index) => {
        card.classList.toggle('ativo', index === treinoEstado.exercicioAtual);
    });

    const larguraCard = cards[0].offsetWidth;
    carrossel.style.transform =
        `translateX(-${treinoEstado.exercicioAtual * larguraCard}px)`;

    resetarTimer();
}

function concluirExercicioAtual() {
    if (treinoEstado.exercicioAtual < treinoEstado.totalExercicios - 1) {
        treinoEstado.exercicioAtual++;
        renderizarEstado();
    } else {
        alert('🎉 Parabéns, treino concluído!');
        window.location.href = '/';
    }
}

function iniciarDescanso(botao) {
    if (timerAtivo) return;

    const texto = botao.querySelector('.texto');
    const progresso = botao.querySelector('.progresso');

    let tempo = 45;
    botao.disabled = true;
    texto.textContent = `${tempo}s`;

    timerAtivo = setInterval(() => {
        tempo--;
        progresso.style.width = `${((45 - tempo) / 45) * 100}%`;
        texto.textContent = `${tempo}s`;

        if (tempo <= 0) {
            resetarTimer();
        }
    }, 1000);
}

function resetarTimer() {
    if (timerAtivo) {
        clearInterval(timerAtivo);
        timerAtivo = null;
    }

    const ativo = document.querySelector('.card-exercicio.ativo');
    if (!ativo) return;

    const btn = ativo.querySelector('.btn-descanso');
    btn.disabled = false;
    btn.querySelector('.texto').textContent = 'Iniciar descanso (45s)';
    btn.querySelector('.progresso').style.width = '0%';
}

document.addEventListener('DOMContentLoaded', () => {
    treinoEstado.totalExercicios =
        document.querySelectorAll('.card-exercicio').length;
    renderizarEstado();
});
