import os
import json
from flask import Flask, render_template, request, send_from_directory

app = Flask(__name__)

# =========================
# PATHS
# =========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
STATIC_DIR = os.path.join(BASE_DIR, "static")

TREINOS_PATH = os.path.join(DATA_DIR, "treinos.json")
EXERCICIOS_PATH = os.path.join(DATA_DIR, "catalogo.json")


# =========================
# LOADERS
# =========================
def carregar_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def buscar_variacao(catalogo, variacao_id):
    for exercicio in catalogo["exercicios"]:
        for variacao in exercicio["variacoes"]:
            if variacao["id"] == variacao_id:
                return {
                    "id": variacao["id"],
                    "nome": variacao["nome"],
                    "descricao": variacao["descricao"],
                    "imagem": variacao.get("imagem"),
                    "video": variacao.get("video"),
                    "metrica": exercicio["metrica_execucao"],
                }
    return None


# =========================
# ROTAS APP
# =========================
@app.route("/")
def home():
    treinos = carregar_json(TREINOS_PATH)
    return render_template("index.html", treinos=treinos)


@app.route("/treino/<id_treino>")
def treino_lista(id_treino):
    treinos = carregar_json(TREINOS_PATH)
    catalogo = carregar_json(EXERCICIOS_PATH)

    treino = next((t for t in treinos if t["id"] == id_treino), None)
    if not treino:
        return "Treino não encontrado", 404

    exercicios = []
    for item in treino["exercicios"]:
        variacao = buscar_variacao(catalogo, item["variacao_id"])
        if variacao:
            exercicios.append({
                "nome": variacao["nome"],
                "imagem": variacao["imagem"],
                "series": item.get("series"),
                "reps": item.get("reps"),
                "tempo": item.get("tempo"),
            })

    return render_template(
        "treino_lista.html",
        treino={
            "id": treino["id"],
            "titulo": treino["titulo"],
            "subtitulo": treino["subtitulo"],
            "duracao": treino["duracao"],
            "exercicios": exercicios,
        }
    )


@app.route("/treino/<id_treino>/executar")
def treino_execucao(id_treino):
    treinos = carregar_json(TREINOS_PATH)
    catalogo = carregar_json(EXERCICIOS_PATH)

    indice = int(request.args.get("i", 0))

    treino = next((t for t in treinos if t["id"] == id_treino), None)
    if not treino:
        return "Treino não encontrado", 404

    exercicios_execucao = []
    for item in treino["exercicios"]:
        variacao = buscar_variacao(catalogo, item["variacao_id"])
        if variacao:
            exercicios_execucao.append({
                "id": variacao["id"],
                "nome": variacao["nome"],
                "descricao": variacao["descricao"],
                "imagem": variacao.get("imagem"),
                "video": variacao.get("video"),
                "series": item.get("series"),
                "reps": item.get("reps"),
                "tempo": item.get("tempo"),
            })

    if indice >= len(exercicios_execucao):
        return "Treino finalizado"

    exercicio_atual = exercicios_execucao[indice]

    return render_template(
        "execucao.html",
        treino=treino,
        exercicio=exercicio_atual,
        indice=indice + 1,
        total=len(exercicios_execucao),
        proximo_indice=indice + 1,
    )


# =========================
# ROTAS PWA (CRÍTICAS)
# =========================
@app.route("/service-worker.js")
def service_worker():
    # precisa estar no ROOT do domínio
    return send_from_directory(STATIC_DIR, "service-worker.js")


@app.route("/manifest.json")
def manifest():
    # opcional, mas garante acesso correto
    return send_from_directory(STATIC_DIR, "manifest.json")


# =========================
# RUN
# =========================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
