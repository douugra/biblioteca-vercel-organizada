from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

app = FastAPI()

class Livro(BaseModel):
    id: int
    titulo: str
    autor: str
    ano: int
    descricao: str

livros: List[Livro] = []
contador = 0

@app.get("/api/livros")
def listar_livros():
    return {"livros": livros, "total": len(livros)}

@app.post("/api/livros")
def adicionar_livro(livro: Livro):
    global contador
    for l in livros:
        if l.id == livro.id:
            raise HTTPException(status_code=400, detail="ID já existe")
    livros.append(livro)
    contador += 1
    return {"mensagem": "Livro adicionado com sucesso"}

@app.put("/api/livros/{livro_id}")
def editar_livro(livro_id: int, livro_atualizado: Livro):
    for i, l in enumerate(livros):
        if l.id == livro_id:
            livros[i] = livro_atualizado
            return {"mensagem": "Livro atualizado com sucesso"}
    raise HTTPException(status_code=404, detail="Livro não encontrado")

@app.delete("/api/livros/{livro_id}")
def deletar_livro(livro_id: int):
    global contador
    for i, l in enumerate(livros):
        if l.id == livro_id:
            livros.pop(i)
            contador -= 1 if contador > 0 else 0
            return {"mensagem": "Livro removido com sucesso"}
    raise HTTPException(status_code=404, detail="Livro não encontrado")
