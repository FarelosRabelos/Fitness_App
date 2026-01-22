document.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById("lista-historico");
  const vazio = document.getElementById("vazio");

  if (!lista || !vazio) {
    console.error("Histórico: elementos não encontrados");
    return;
  }

  let historico = [];

  try {
    historico = JSON.parse(
      localStorage.getItem("coreon_historico") || "[]"
    );
  } catch (e) {
    console.error("Histórico corrompido no localStorage");
    vazio.style.display = "block";
    return;
  }

  if (!Array.isArray(historico) || historico.length === 0) {
    vazio.style.display = "block";
    return;
  }

  vazio.style.display = "none";

  historico.slice().reverse().forEach(item => {
    if (!item || !item.treino_nome || !item.data) return;

    const li = document.createElement("li");
    li.className = "item";

    if (item.imagem) {
      li.style.backgroundImage =
        `url('/static/imagens/silhuetas/${item.imagem}')`;
    }

    const data = new Date(item.data).toLocaleString("pt-BR", {
      dateStyle: "long",
      timeStyle: "short"
    });

    li.innerHTML = `
      <div class="item-conteudo">
        <strong>${item.treino_nome}</strong>
        <small>${data}</small>
      </div>
    `;

    lista.appendChild(li);
  });
});
