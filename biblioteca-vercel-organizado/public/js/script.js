const apiUrl = "/api/livros";

async function carregarLivros() {
  const res = await fetch(apiUrl);
  const data = await res.json();
  const tbody = document.getElementById("lista-livros");
  tbody.innerHTML = "";
  data.livros.forEach(livro => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${livro.id}</td>
      <td>${livro.titulo}</td>
      <td>${livro.autor}</td>
      <td>${livro.ano}</td>
      <td>${livro.descricao}</td>
      <td>
        <button onclick="editarLivro(${livro.id})">Editar</button>
        <button onclick="deletarLivro(${livro.id})">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  document.getElementById("contador").textContent = data.total;
}

document.getElementById("form-livro").addEventListener("submit", async (e) => {
  e.preventDefault();
  const livro = {
    id: parseInt(document.getElementById("id").value),
    titulo: document.getElementById("titulo").value,
    autor: document.getElementById("autor").value,
    ano: parseInt(document.getElementById("ano").value),
    descricao: document.getElementById("descricao").value
  };
  await fetch(apiUrl, { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(livro) });
  carregarLivros();
  e.target.reset();
});

async function deletarLivro(id) { await fetch(`${apiUrl}/${id}`, { method: "DELETE" }); carregarLivros(); }

async function editarLivro(id) {
  const titulo = prompt("Novo título:");
  const autor = prompt("Novo autor:");
  const ano = prompt("Novo ano:");
  const descricao = prompt("Nova descrição:");
  const livroAtualizado = { id, titulo, autor, ano: parseInt(ano), descricao };
  await fetch(`${apiUrl}/${id}`, { method: "PUT", headers: {"Content-Type": "application/json"}, body: JSON.stringify(livroAtualizado) });
  carregarLivros();
}

carregarLivros();