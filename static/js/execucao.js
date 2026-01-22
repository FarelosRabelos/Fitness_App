(function () {
  const btnDescanso = document.getElementById("btn-descanso");
  const btnProximo = document.getElementById("btn-proximo");
  const nextLink = document.getElementById("next-exercise");
  const valorCarga = document.getElementById("valor-carga");
  const textoSerie = document.getElementById("texto-serie");

  const STORAGE_CARGAS = "coreon_cargas";
  const TEMPO_DESCANSO = 45;

  const TOTAL_SERIES = parseInt(textoSerie.dataset.totalSeries, 10);

  let intervalo = null;
  let cargaAtual = 0;
  let serieAtual = 1;

  function carregarCargas() {
    return JSON.parse(localStorage.getItem(STORAGE_CARGAS) || "{}");
  }

  function salvarCargas(cargas) {
    localStorage.setItem(STORAGE_CARGAS, JSON.stringify(cargas));
  }

  function carregarCargaAtual() {
    const cargas = carregarCargas();
    cargaAtual = cargas[EXERCICIO_ID] || 0;
    valorCarga.textContent = cargaAtual;
  }

  /* edição direta da carga */
  valorCarga.addEventListener("blur", () => {
    let valor = valorCarga.textContent
      .replace(",", ".")
      .replace(/[^\d.]/g, "");

    let numero = parseFloat(valor);
    if (isNaN(numero) || numero < 0) numero = 0;

    /* passo de 2.5kg */
    numero = Math.round(numero / 2.5) * 2.5;

    cargaAtual = numero;
    valorCarga.textContent = numero;

    const cargas = carregarCargas();
    cargas[EXERCICIO_ID] = cargaAtual;
    salvarCargas(cargas);
  });

  valorCarga.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      valorCarga.blur();
    }
  });

  window.alterarCarga = function (delta) {
    cargaAtual = Math.max(0, cargaAtual + delta);
    valorCarga.textContent = cargaAtual;

    const cargas = carregarCargas();
    cargas[EXERCICIO_ID] = cargaAtual;
    salvarCargas(cargas);
  };

  /* DESCANSO */
  btnDescanso.addEventListener("click", () => {
    if (intervalo) return;
    if (serieAtual > TOTAL_SERIES) return;

    document.body.classList.add("estado-descanso");

    let restante = TEMPO_DESCANSO;
    btnDescanso.disabled = true;
    btnDescanso.textContent = `Descanso ${restante}s`;

    intervalo = setInterval(() => {
      restante--;
      btnDescanso.textContent = `Descanso ${restante}s`;

      if (restante <= 0) {
        clearInterval(intervalo);
        intervalo = null;

        document.body.classList.remove("estado-descanso");
        avancarSerie();
      }
    }, 1000);
  });

  function avancarSerie() {
    if (serieAtual < TOTAL_SERIES) {
      serieAtual++;
      textoSerie.textContent = `Série ${serieAtual}`;
      btnDescanso.textContent = "Iniciar descanso (45s)";
      btnDescanso.disabled = false;
    } else {
      btnDescanso.textContent = "Séries concluídas";
      btnDescanso.disabled = true;
      serieAtual++;
    }
  }

  btnProximo.addEventListener("click", () => {
    nextLink.click();
  });

  carregarCargaAtual();
})();
