const API_URL = "https://biblioteca-vercel-mibj.vercel.app/api/livros";

const form = document.getElementById("formLivro");
const listaLivros = document.getElementById("listaLivros");
const contador = document.getElementById("contador");

let livros = [];

// Função para renderizar os livros
function renderizarLivros() {
  listaLivros.innerHTML = "";
  livros.forEach(l => {
    const card = document.createElement("div");
    card.className = "bg-white p-4 rounded-xl shadow-lg flex flex-col gap-2";
    card.innerHTML = `
      <h2 class="text-xl font-bold">${l.titulo}</h2>
      <p class="text-sm text-gray-600">Autor: ${l.autor}</p>
      <p class="text-sm text-gray-600">Ano: ${l.ano || '-'}</p>
      <p class="text-gray-700">${l.descricao || ''}</p>
      <div class="flex gap-2 mt-2">
        <button class="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600" onclick="editarLivro(${l.id})">Editar</button>
        <button class="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600" onclick="deletarLivro(${l.id})">Excluir</button>
      </div>
    `;
    listaLivros.appendChild(card);
  });
  contador.textContent = livros.length;
}

// Buscar livros da API
async function fetchLivros() {
  try {
    const res = await fetch(API_URL);
    livros = await res.json();
    renderizarLivros();
  } catch (err) {
    console.error("Erro ao buscar livros:", err);
  }
}

// Adicionar livro
form.addEventListener("submit", async e => {
  e.preventDefault();
  const novoLivro = {
    titulo: document.getElementById("titulo").value,
    autor: document.getElementById("autor").value,
    ano: document.getElementById("ano").value,
    descricao: document.getElementById("descricao").value
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoLivro)
    });
    const criado = await res.json();
    livros.push(criado);
    renderizarLivros();
    form.reset();
  } catch (err) {
    console.error("Erro ao adicionar livro:", err);
  }
});

// Editar livro
window.editarLivro = async id => {
  const livro = livros.find(l => l.id === id);
  if (!livro) return;

  const novoTitulo = prompt("Novo título:", livro.titulo) || livro.titulo;
  const novoAutor = prompt("Novo autor:", livro.autor) || livro.autor;
  const novoAno = prompt("Novo ano:", livro.ano) || livro.ano;
  const novaDescricao = prompt("Nova descrição:", livro.descricao) || livro.descricao;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo: novoTitulo,
        autor: novoAutor,
        ano: novoAno,
        descricao: novaDescricao
      })
    });
    const atualizado = await res.json();
    livros = livros.map(l => l.id === id ? atualizado : l);
    renderizarLivros();
  } catch (err) {
    console.error("Erro ao editar livro:", err);
  }
};

// Deletar livro
window.deletarLivro = async id => {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    livros = livros.filter(l => l.id !== id);
    renderizarLivros();
  } catch (err) {
    console.error("Erro ao deletar livro:", err);
  }
};

// Inicialização
fetchLivros();
