from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Modelos
class Livro(BaseModel):
    id: int
    titulo: str
    autor: str
    ano: int
    descricao: str

class LivroEntrada(BaseModel):
    titulo: str
    autor: str
    ano: int
    descricao: str

# Banco em memória
livros: List[Livro] = []
contador = 0

# Listar livros
@app.get("/api/livros")
def listar_livros():
    return {"livros": livros, "total": len(livros)}

# Adicionar livro
@app.post("/api/livros")
def adicionar_livro(livro: LivroEntrada):
    global contador
    contador += 1
    novo_livro = Livro(id=contador, **livro.dict())
    livros.append(novo_livro)
    return {"mensagem": "Livro adicionado com sucesso", "id": novo_livro.id}

# Editar livro
@app.put("/api/livros/{livro_id}")
def editar_livro(livro_id: int, livro_atualizado: LivroEntrada):
    for i, l in enumerate(livros):
        if l.id == livro_id:
            livros[i] = Livro(id=livro_id, **livro_atualizado.dict())
            return {"mensagem": "Livro atualizado com sucesso"}
    raise HTTPException(status_code=404, detail="Livro não encontrado")

# Deletar livro
@app.delete("/api/livros/{livro_id}")
def deletar_livro(livro_id: int):
    global contador
    for i, l in enumerate(livros):
        if l.id == livro_id:
            livros.pop(i)
            return {"mensagem": "Livro removido com sucesso"}
    raise HTTPException(status_code=404, detail="Livro não encontrado")
