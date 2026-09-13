// ===== Elementos da página =====
const formulario = document.getElementById("formulario");
const cep = document.getElementById("cep");
const cepStatus = document.getElementById("cep-status");
const logradouro = document.getElementById("logradouro");
const bairro = document.getElementById("bairro");
const listaOS = document.getElementById("lista-os");
const comprovante = document.getElementById("comprovante");
const comprovanteInfo = document.getElementById("comprovante-info");
const qrcode = document.getElementById("qrcode");

// ===== Busca do CEP na API =====
cep.addEventListener("input", async () => {

  cep.value = cep.value.replace(/\D/g, "");

  if (cep.value.length !== 8) {
    cepStatus.textContent = "Localizando...";
    cepStatus.className = "buscando";
    return;
  }

  cepStatus.textContent = "Localizando...";

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cep.value}/json/`);
    const dados = await resposta.json();

    if (dados.erro) {
      cepStatus.textContent = "CEP não encontrado.";
      cepStatus.className = "falha";
      return;
    }

    logradouro.value = dados.logradouro;
    bairro.value = dados.bairro;
    cepStatus.textContent = "Endereço encontrado.";
    cepStatus.className = "sucesso";
    document.getElementById("numero").focus();
  } catch {
    cepStatus.textContent = "Erro ao consultar o CEP. Verifique sua conexão.";
  }
});

//        Guardar e ler as OS do localStorage
function lerOS() {
  return JSON.parse(localStorage.getItem("ordens")) || [];
}

function proximoNumero() {
  const atual = Number(localStorage.getItem("contadorOS")) || 0;
  const novo = atual + 1;
  localStorage.setItem("contadorOS", novo);
  return novo;
}

//          Mostrar a lista na tela 
function mostrarLista() {
  const ordens = lerOS();
  listaOS.innerHTML = "";

  if (ordens.length === 0) {
    listaOS.innerHTML = "<li>Nenhuma ordem cadastrada ainda.</li>";
    return;
  }

  ordens.forEach((os) => {
    const item = document.createElement("li");

    item.innerHTML = `
      <strong>OS ${String(os.numero).padStart(4, "0")}</strong> — ${os.nome}<br>
      ${os.dispositivo} · entrada em ${os.data.split("-").reverse().join("/")}<br>
      <em>${os.defeito}</em>
    `;

    if (os.foto) {
      const img = document.createElement("img");
      img.src = os.foto;
      img.alt = `Foto do equipamento da OS ${os.numero}`;
      img.className = "foto-os";
      item.appendChild(img);
    }

    listaOS.appendChild(item);
  });
}

// ===== Câmera =====
const video = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const preview = document.getElementById("preview");
const fotoStatus = document.getElementById("foto-status");
const btnCamera = document.getElementById("btn-camera");
const btnCapturar = document.getElementById("btn-capturar");
const btnRefazer = document.getElementById("btn-refazer");

let stream = null;
let fotoAtual = null;

btnCamera.addEventListener("click", async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });
    video.srcObject = stream;
    video.hidden = false;
    btnCamera.hidden = true;
    btnCapturar.hidden = false;
    fotoStatus.textContent = "";
  } catch (erro) {
    if (erro.name === "NotAllowedError") {
      fotoStatus.textContent = "Permissão de câmera negada.";
    } else if (erro.name === "NotFoundError") {
      fotoStatus.textContent = "Nenhuma câmera encontrada neste dispositivo.";
    } else {
      fotoStatus.textContent = "Não foi possível acessar a câmera.";
    }
    fotoStatus.className = "falha";
  }
});

btnCapturar.addEventListener("click", () => {
  // reduz a largura para 640px, mantendo a proporção
  const largura = 640;
  const altura = (video.videoHeight / video.videoWidth) * largura;

  canvas.width = largura;
  canvas.height = altura;
  canvas.getContext("2d").drawImage(video, 0, 0, largura, altura);

  // converte para JPEG comprimido
  fotoAtual = canvas.toDataURL("image/jpeg", 0.7);

  preview.src = fotoAtual;
  preview.hidden = false;
  video.hidden = true;
  btnCapturar.hidden = true;
  btnRefazer.hidden = false;
  fotoStatus.textContent = "Foto registrada.";
  fotoStatus.className = "sucesso";

  pararCamera();
});

btnRefazer.addEventListener("click", () => {
  fotoAtual = null;
  preview.hidden = true;
  btnRefazer.hidden = true;
  btnCamera.hidden = false;
  fotoStatus.textContent = "";
  fotoStatus.className = "";
});

function pararCamera() {
  if (stream) {
    stream.getTracks().forEach((faixa) => faixa.stop());
    stream = null;
  }
}

function limparCamera() {
  pararCamera();
  fotoAtual = null;
  preview.hidden = true;
  video.hidden = true;
  btnCapturar.hidden = true;
  btnRefazer.hidden = true;
  btnCamera.hidden = false;
  fotoStatus.textContent = "";
  fotoStatus.className = "";
}

// Envio do formulário
formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const os = {
    numero: proximoNumero(),
    nome: document.getElementById("nome").value,
    telefone: document.getElementById("telefone").value,
    cep: cep.value,
    logradouro: logradouro.value,
    numeroCasa: document.getElementById("numero").value,
    complemento: document.getElementById("complemento").value,
    bairro: bairro.value,
    dispositivo: document.getElementById("dispositivo").value,
    data: document.getElementById("data_de_entrada").value,
    defeito: document.getElementById("defeito").value,
    foto: fotoAtual,
  };


  const ordens = lerOS();
  ordens.unshift(os);
  localStorage.setItem("ordens", JSON.stringify(ordens));

  gerarQRCode(os);
  mostrarLista();
  formulario.reset();
  limparCamera();
  cepStatus.textContent = "";
});

// ===== QR Code da via do cliente =====
function gerarQRCode(os) {
  const numeroOS = String(os.numero).padStart(4, "0");
  const dataBR = os.data.split("-").reverse().join("/");

  // monta o link da via com os dados dentro da própria URL
  const link = new URL("via.html", window.location.href);
  link.searchParams.set("os", numeroOS);
  link.searchParams.set("nome", os.nome);
  link.searchParams.set("disp", os.dispositivo);
  link.searchParams.set("data", dataBR);

  qrcode.src =
    "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
    encodeURIComponent(link.href);

  comprovanteInfo.textContent = `Ordem de serviço ${numeroOS} registrada em nome de ${os.nome}.`;
  comprovante.hidden = false;
  comprovante.scrollIntoView({ behavior: "smooth" });
}
// Ao abrir a página 
mostrarLista();
// ===== Registro do Service Worker =====
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js");
  });
}