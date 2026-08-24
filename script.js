const formulario = document.getElementById("formulario");

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;

    if (nome === "" || telefone === "") {
        alert("Preencha o nome e o telefone!");
        return;
    }

    alert("Cadastro de " + nome + " realizado!");
});