# Aula 14 — Erros, exceções e middleware

## Onde o middleware foi colocado

No `Program.cs`, logo depois de `var app = builder.Build();` e antes dos outros
middlewares (`UseDefaultFiles`, `UseStaticFiles`) e dos mapeamentos das rotas
(`app.Map...`). Assim ele envolve a execução dos endpoints e recebe qualquer
exceção lançada durante o processamento.

## Teste controlado (rota temporária, já removida)

API iniciada localmente em Production
(`ASPNETCORE_ENVIRONMENT=Production` e `dotnet run --no-launch-profile`).

Ferramenta usada nos testes: curl no PowerShell (no lugar do Bruno).

- Método: GET
- Rota: `/api/teste-erro`
- Status: 500
- Corpo recebido:

```json
{"mensagem":"Ocorreu um erro interno. Tente novamente mais tarde."}
```

O texto "Falha simulada para teste." não apareceu na resposta ao cliente.
Depois do teste, a rota temporária foi removida do `Program.cs`.

## Endpoint normal

- Método: GET
- Rota: `/api/drivers`
- Status: 200

## Teste de ID inexistente
- Método: GET
- Rota: `/api/drivers/999`
- Status: 404. É um resultado previsto, e o middleware não o transformou em 500.

## Por que não enviar a mensagem bruta da exceção ao cliente

A mensagem original da exceção é um diagnóstico para quem desenvolve, não para quem usa a API. Se ela fosse devolvida, poderia revelar informações técnicas sobre o sistema. Por isso o middleware responde com uma mensagem genérica e mantém o detalhe apenas no servidor.    