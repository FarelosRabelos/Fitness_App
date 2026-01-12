import os
import json
from flask import Flask, render_template

app = Flask(__name__)

# =========================
# PATHS
# =========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')

EXERCICIOS_PATH = os.path.join(DATA_DIR, 'catalogo.json')
TREINOS_PATH = os.path.join(DATA_DIR, 'treinos.json')

# =========================
# LOADERS
# =========================
def carregar_treinos():
    with open(TREINOS_PATH, encoding='utf-8') as arquivo:
        return json.load(arquivo)


def carregar_exercicios():
    with open(EXERCICIOS_PATH, encoding='utf-8') as arquivo:
        return json.load(arquivo)


def buscar_variacao(catalogo, variacao_id):
    for exercicio in catalogo["exercicios"]:
        for variacao in exercicio["variacoes"]:
            if variacao["id"] == variacao_id:
                return {
                    "id": variacao["id"],
                    "nome": variacao["nome"],
                    "descricao": variacao["descricao"],
                    "imagem": variacao.get("imagem"),
                    "tipo_carga": variacao.get("tipo_carga"),
                    "metrica_execucao": exercicio["metrica_execucao"]
                }
    return None


# =========================
# ROTAS
# =========================
@app.route('/')
def home():
    treinos = carregar_treinos()
    return render_template('index.html', treinos=treinos)


@app.route('/treino/<id_treino>')
def treino_lista(id_treino):
    treinos = carregar_treinos()

    treino = next(
        (t for t in treinos if str(t["id"]) == id_treino),
        None
    )

    if not treino:
        return "Treino não encontrado", 404

    return render_template(
        'treino_lista.html',
        treino=treino
    )


@app.route('/treino/<id_treino>/executar')
def treino_execucao(id_treino):
    treinos = carregar_treinos()
    catalogo = carregar_exercicios()

    treino = next(
        (t for t in treinos if str(t["id"]) == id_treino),
        None
    )

    if not treino:
        return "Treino não encontrado", 404

    exercicios_execucao = []

    for item in treino["exercicios"]:
        variacao_id = item.get("variacao_id")
        if not variacao_id:
            continue

        variacao = buscar_variacao(catalogo, variacao_id)
        if not variacao:
            continue

        exercicio_final = {
            "id": variacao["id"],
            "nome": variacao["nome"],
            "descricao": variacao["descricao"],
            "imagem": variacao["imagem"],
            "metrica_execucao": variacao["metrica_execucao"],
            "series": item.get("series"),
            "reps": item.get("reps"),
            "tempo": item.get("tempo")
        }

        exercicios_execucao.append(exercicio_final)

    treino_execucao_data = {
        "id": treino["id"],
        "nome": treino["nome"],
        "exercicios": exercicios_execucao
    }


    return render_template(
        "execucao.html",
        treino=treino_execucao_data
    )


# =========================
# RUN
# =========================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
