const parametros = new URLSearchParams(window.location.search);

const numero = parametros.get("os");
const nome = parametros.get("nome");
const dispositivo = parametros.get("disp");
const data = parametros.get("data");

if (!numero || !nome) {
  document.getElementById("via").innerHTML =
    "<h1>Via não encontrada</h1><p>Este link está incompleto ou inválido.</p>";
} else {
  document.getElementById("titulo-os").textContent = `Ordem de Serviço ${numero}`;
  document.getElementById("via-nome").textContent = nome;
  document.getElementById("via-dispositivo").textContent = dispositivo;
  document.getElementById("via-data").textContent = data;
  document.title = `OS ${numero} | Santino Informática`;
}

document.getElementById("btn-pdf").addEventListener("click", () => {
  window.print();
});