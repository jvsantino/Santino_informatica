# Santino Informática — Sistema de Ordens de Serviço

Aplicação web responsiva para cadastro de ordens de serviço de uma
assistência técnica de informática, desenvolvida como Atividade
Individual 2 da disciplina de Coding Mobile (ADS — SENAC PE).

**Aplicação publicada:** https://jvsantino.github.io/Santino_informatica/

## Funcionalidades

- Cadastro de ordem de serviço com dados do cliente, endereço e equipamento
- Busca automática de endereço pelo CEP, consumindo a API ViaCEP
- Numeração sequencial das OS, sem repetição mesmo após exclusões
- Armazenamento local das ordens cadastradas (localStorage)
- Geração de QR Code com a via do cliente
- Segunda tela (`via.html`) que monta a via a partir dos dados na URL
- Exportação da via em PDF pelo próprio navegador

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
script.js → busca de CEP, persistência e geração do QR
via.js → leitura dos dados da URL e montagem da via

## Decisões de projeto

**Mobile-first:** o CSS base atende telas pequenas e cresce a partir de
720px via media query.

**Fontes do sistema:** nenhuma fonte externa é carregada, evitando
requisições que penalizariam a performance.

**Acessibilidade:** uso de HTML semântico (`header`, `main`, `fieldset`,
`legend`), rótulos associados a todos os campos e `aria-live` na mensagem
de status do CEP, que faz leitores de tela anunciarem o resultado da busca.

**Tratamento de falhas na API:** as duas situações são tratadas
separadamente — CEP inexistente (a API responde com `erro`) e falha de
conexão (capturada pelo `catch`), cada uma com sua mensagem.

## Limitações conhecidas

Os dados são gravados no `localStorage`, que é isolado por navegador e por
dispositivo. As ordens cadastradas em um aparelho não são visíveis em
outro. A evolução natural seria um banco de dados em nuvem (Firebase ou
Supabase) ou um backend próprio, fora do escopo desta atividade por se
tratar de hospedagem estática.

## Resultado no Google Lighthouse (mobile)

| Categoria | Nota |
|---|---|
| Performance | 95 |
| Acessibilidade | 100 |
| Boas práticas | 100 |
| SEO | 100 |

## Autor

João Victor Santino — ADS / SENAC Pernambuco
