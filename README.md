# Santino Informática — Sistema de Ordens de Serviço (PWA)

Aplicação web progressiva para cadastro de ordens de serviço de uma
assistência técnica de informática, desenvolvida ao longo das atividades
individuais da disciplina de Coding Mobile (ADS — SENAC PE).

**Aplicação publicada:** https://jvsantino.github.io/Santino_informatica/

## Funcionalidades

- Cadastro de ordem de serviço com dados do cliente, endereço e equipamento
- Busca automática de endereço pelo CEP, consumindo a API ViaCEP
- Registro fotográfico do equipamento usando a câmera do dispositivo
- Numeração sequencial das OS, sem repetição mesmo após exclusões
- Armazenamento local das ordens cadastradas (localStorage)
- Geração de QR Code com a via do cliente
- Segunda tela (`via.html`) que monta a via a partir dos dados na URL
- Exportação da via em PDF pelo próprio navegador
- Instalável como aplicativo e funcional sem conexão

## Progressive Web App

A aplicação é instalável em dispositivos móveis e desktop. A instalação é
oferecida pelo próprio navegador ao acessar o endereço publicado.

**Manifest** (`manifest.json`) define nome, ícones, cor de tema e o modo
`standalone`, que faz o app abrir sem a barra de endereço do navegador.

**Service Worker** (`sw.js`) armazena os arquivos da aplicação em cache na
instalação, permitindo que o app abra sem conexão. As chamadas às APIs
externas são deliberadamente excluídas do cache, já que consultas de CEP
precisam sempre de dados atuais. O nome do cache é versionado, de modo que
uma nova versão descarta automaticamente os arquivos antigos.

**Ícones** em 192x192 e 512x512, incluindo uma variante *maskable* com
margem de segurança para o recorte que o Android aplica conforme o tema do
usuário.

## Recurso de hardware: câmera

O cadastro permite fotografar o equipamento no momento da entrada, o que
registra o estado em que o aparelho chegou à oficina.

O acesso é feito via `navigator.mediaDevices.getUserMedia()`, solicitando a
câmera traseira (`facingMode: "environment"`). O quadro capturado é
desenhado em um `<canvas>`, redimensionado para 640px de largura e
convertido em JPEG com compressão, reduzindo a imagem de vários megabytes
para dezenas de kilobytes — necessário porque o `localStorage` tem limite
aproximado de 5 MB.

A câmera é encerrada explicitamente após a captura, liberando o hardware e
apagando o indicador de uso do dispositivo.

Três situações de falha são tratadas separadamente: permissão negada pelo
usuário, ausência de câmera no dispositivo e demais erros de acesso.

## APIs utilizadas

| API | Uso |
|---|---|
| [ViaCEP](https://viacep.com.br) | Consulta de endereço a partir do CEP digitado |
| [QR Server](https://goqr.me/api/) | Geração da imagem do QR Code da via do cliente |

Nenhuma das duas exige chave de acesso ou cadastro.

## Tecnologias

HTML5, CSS3 e JavaScript puro, sem frameworks ou bibliotecas externas.
Hospedagem em GitHub Pages.

## Estrutura
index.html → tela de cadastro
via.html → via do cliente (aberta pelo QR Code)
style.css → estilos das duas telas, incluindo regras de impressão
script.js → busca de CEP, câmera, persistência e geração do QR
via.js → leitura dos dados da URL e montagem da via
manifest.json → configuração do PWA
sw.js → service worker (cache e funcionamento offline)
icons/ → ícones da aplicação


## Decisões de projeto

**Mobile-first:** o CSS base atende telas pequenas e cresce a partir de
720px via media query.

**Fontes do sistema:** nenhuma fonte externa é carregada, evitando
requisições que penalizariam a performance.

**Acessibilidade:** uso de HTML semântico (`header`, `main`, `fieldset`,
`legend`), rótulos associados a todos os campos e `aria-live` nas mensagens
de status do CEP e da câmera, que faz leitores de tela anunciarem o
resultado das operações.

**Tratamento de falhas na API:** as duas situações são tratadas
separadamente — CEP inexistente (a API responde com `erro`) e falha de
conexão (capturada pelo `catch`), cada uma com sua mensagem.

## Limitações conhecidas

Os dados são gravados no `localStorage`, que é isolado por navegador e por
dispositivo. As ordens cadastradas em um aparelho não são visíveis em
outro. A evolução natural seria um banco de dados em nuvem (Firebase ou
Supabase) ou um backend próprio, fora do escopo desta atividade por se
tratar de hospedagem estática.

Por consequência, a aplicação não possui autenticação nem controle de
acesso, o que exigiria um servidor: qualquer verificação executada no
navegador do usuário pode ser desabilitada por ele.

A via do cliente trafega seus dados na própria URL do QR Code. Por isso
apenas número da OS, nome, equipamento e data são incluídos, deixando
telefone e endereço de fora.

## Resultado no Google Lighthouse (mobile)

| Categoria | Nota |
|---|---|
| Performance | 97 |
| Acessibilidade | 100 |
| Boas práticas | 100 |
| SEO | 100 |
    

## Autor

João Victor Santino — ADS / SENAC Pernambuco
