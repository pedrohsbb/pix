# PIX Participants – Correção e Testes

Este projeto corrige um problema identificado no endpoint de consulta de participantes PIX e adiciona testes automatizados para garantir confiabilidade, previsibilidade e facilidade de manutenção do código.

---

## Correção do bug

O endpoint `GET /pix/participants/:ispb` retornava **404 para ISPBs válidos** devido a uma comparação incorreta entre o ISPB recebido na rota e o ISPB retornado pelo serviço externo.

O problema ocorria porque:
- o ISPB da rota é recebido como **string**;
- o payload externo pode retornar o ISPB como **number** ou string em formato diferente;
- a comparação direta falhava em casos comuns (ex.: `"00000123"` vs `123`).

### Solução aplicada
- Implementação de uma função de **normalização de ISPB**, que:
  - remove caracteres não numéricos;
  - padroniza o valor para 8 dígitos (com zeros à esquerda quando aplicável).
- A busca passou a comparar **ISPBs normalizados**.
- Suporte a payloads que utilizam tanto `ispb` quanto `ISPB`.
- Falhas na obtenção da lista externa retornam **502 (BCB unavailable)**, evitando respostas incorretas.

---

## Testes unitários e de integração

### Testes unitários
Foram criados testes para validar:
- normalização de ISPB (string, number, zeros à esquerda, valores inválidos);
- busca correta de participantes independentemente do formato do ISPB;
- funcionamento do cache com TTL;
- renovação do cache após expiração.

### Testes de integração
Foram adicionados testes do endpoint cobrindo:
- retorno **200** quando o participante é encontrado;
- retorno **404** quando não existe participante para o ISPB informado;
- retorno **502** quando o serviço externo está indisponível;
- verificação de uso do cache (evita múltiplas chamadas dentro do TTL).

Os testes são **determinísticos** e **não dependem de acesso à internet**, utilizando mock do cliente HTTP.

---

## Explicação técnica das decisões

- **Normalização de ISPB** elimina inconsistências de tipo e formatação, evitando falsos negativos.
- **Separação de responsabilidades**:
  - rotas HTTP isoladas da lógica de negócio;
  - repositório responsável por fetch, cache e busca;
  - regras puras (ISPB) isoladas e facilmente testáveis.
- **Injeção de dependências** (HTTP client e clock):
  - facilita testes;
  - evita dependência direta de serviços externos.
- **Cache com TTL**:
  - reduz chamadas desnecessárias;
  - melhora desempenho e resiliência.
- **Tratamento explícito de erros**:
  - falhas externas resultam em respostas previsíveis e controladas.

---

## Código limpo e organizado

- Estrutura clara de pastas (`src`, `tests/unit`, `tests/integration`);
- Funções pequenas, com responsabilidade única;
- Nomes explícitos e legíveis;
- Ausência de estado global difícil de testar;
- Implementação simples, sem overengineering, mas preparada para evolução.

---

## Como rodar o projeto

### Pré-requisitos
- Node.js (v18+ recomendado)
- npm

### 1. Instalar dependências
```bash
npm install
