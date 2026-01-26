const ORDEM_ROTINA = [
  "superior_empurrar",
  "inferior_quadriceps",
  "superior_puxar",
  "inferior_posterior",
  "abdomen"
];

const IMAGENS = {
  superior_empurrar: "superiores.png",
  superior_puxar: "costas.png",
  inferior_quadriceps: "pernas.png",
  inferior_posterior: "inferiores.png",
  abdomen: "abd.png"
};

function obterProximoTreino() {
  const historico = JSON.parse(
    localStorage.getItem("coreon_historico") || "[]"
  );

  if (historico.length === 0) {
    return ORDEM_ROTINA[0];
  }

  const ultimo = historico[historico.length - 1].treino_id;
  const index = ORDEM_ROTINA.indexOf(ultimo);

  if (index === -1) {
    return ORDEM_ROTINA[0];
  }

  return ORDEM_ROTINA[(index + 1) % ORDEM_ROTINA.length];
}

function atualizarDestaque() {
  const tipo = obterProximoTreino();

  const TITULO = {
    superior_empurrar: "Superior",
    superior_puxar: "Superior",
    inferior_quadriceps: "Inferior",
    inferior_posterior: "Inferior",
    abdomen: "Abdômen"
  };

  const SUBTITULO = {
    superior_empurrar: "Empurrar",
    superior_puxar: "Puxar",
    inferior_quadriceps: "Quadríceps",
    inferior_posterior: "Posterior e glúteos",
    abdomen: "Core completo"
  };

  document.getElementById("destaque-titulo").textContent = TITULO[tipo];
  document.getElementById("destaque-subtitulo").textContent = SUBTITULO[tipo];

  document.querySelector(".destaque-bg").style.backgroundImage =
    `url('/static/imagens/silhuetas/${IMAGENS[tipo]}')`;

  document.getElementById("btn-destaque").href = `/treino/${tipo}`;
}

atualizarDestaque();
