# Santino Informática — Ordens de Serviço

Página web responsiva para cadastro de ordens de serviço de uma assistência técnica de informática. O formulário registra os dados do cliente e do equipamento que entrou para conserto.

## Acesse

https://jvsantino.github.io/Santino_informatica/

## Sobre o projeto

Projeto desenvolvido para a disciplina de Web Responsivo do curso de Análise e Desenvolvimento de Sistemas (Senac).

O formulário coleta seis informações: nome, endereço, telefone, dispositivo, data de entrada e defeito relatado. Antes de confirmar o cadastro, o JavaScript verifica se o nome e o telefone foram preenchidos — sem esses dois campos não há como entrar em contato com o cliente quando o serviço ficar pronto.

## Tecnologias

- HTML5
- CSS3
- JavaScript

## Funcionalidades

- Formulário com campos de tipos apropriados (`text`, `tel`, `date` e `textarea`)
- Labels associados aos campos pelo atributo `for`, para acessibilidade
- Validação dos campos obrigatórios via JavaScript
- Bloqueio do recarregamento da página no envio, usando `preventDefault()`
## Autor

João Victor Santino
- Layout responsivo construído em mobile first, com media query para telas maiores

## Estrutura
