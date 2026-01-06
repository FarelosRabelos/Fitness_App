import os # Importa o módulo os para manipulação de caminhos de arquivos
import json #Importa o módulo json para manipulação de arquivos JSON
from flask import Flask, render_template # Isso import a o Flask e a função render_template

app = Flask(__name__) 

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
TREINOS_PATH = os.path.join(DATA_DIR, 'treinos.json')

@app.route('/') # Define a rota para a página inicial
def home(): #função que renderiza a página inicial
    with open(TREINOS_PATH, encoding='utf-8') as arquivo: # Abre o arquivo JSON com os dados dos treinos
        treinos = json.load(arquivo) # Carrega os dados do arquivo JSON
    
    return render_template('index.html', treinos=treinos) # Renderiza o template index.html passando os dados dos treinos

@app.route('/treino/<id_treino>')
def treino(id_treino):
    with open(TREINOS_PATH, encoding='utf-8') as arquivo: # Abre o arquivo JSON com os dados dos treinos
        treinos = json.load(arquivo) # Carrega os dados do arquivo JSON

    treino_selecionado = None
    for treino in treinos:
        if str(treino['id']) == id_treino:
            treino_selecionado = treino
            break

    if treino_selecionado:
        return render_template('treino.html', treino=treino_selecionado)
    else:
        return "Treino não encontrado", 404

if __name__ == '__main__':
    app.run(debug=True) # Executa o aplicativo Flask em modo de depuração