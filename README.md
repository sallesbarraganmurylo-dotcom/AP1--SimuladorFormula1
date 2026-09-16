# ApiSimuladorFormula1

## Nome, tema e objetivo

**ApiSimuladorFormula1** é uma API REST desenvolvida em ASP.NET Core (.NET 10), com o tema de um simulador de corrida de Fórmula 1. O objetivo da aplicação é gerenciar um cadastro de pilotos, permitindo listar, buscar, cadastrar, atualizar e remover pilotos através de operações CRUD, servindo como projeto de estudo e avaliação (AP1) de construção de APIs REST com Minimal APIs.

## Requisitos

- [.NET 10 SDK](https://dotnet.microsoft.com/download) instalado (`dotnet --version` deve retornar 10.x)

## Como executar o projeto

Clone o repositório e, na pasta raiz do projeto (onde está o arquivo `.csproj`), execute:

```bash
dotnet restore
dotnet build
dotnet run
```

O terminal exibirá a URL em que a API está rodando, por exemplo:

```
Now listening on: http://localhost:5001
```

## URL local utilizada nos testes

```
http://localhost:5001
```

> Obs.: a porta pode variar conforme a configuração local (`launchSettings.json`). Sempre confira a porta exibida no terminal ao rodar `dotnet run`.

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Verifica se a API está no ar; retorna uma mensagem de boas-vindas. |
| GET | `/api/teams` | Lista todos os pilotos cadastrados. |
| GET | `/api/drivers/{id}` | Busca um piloto específico pelo id. Retorna 404 se não encontrado. |
| POST | `/api/drivers` | Cadastra um novo piloto. |
| PUT | `/api/drivers/{id}` | Atualiza os dados de um piloto existente pelo id. Retorna 404 se não encontrado. |
| DELETE | `/api/drivers/{id}` | Remove um piloto pelo id. Retorna 404 se não encontrado. |

## Exemplos de JSON

### POST `/api/drivers`

**Request body:**
```json
{
  "titulo": "Fernando Alonso"
}
```

**Response (201 Created):**
```json
{
  "id": 3,
  "titulo": "Fernando Alonso",
  "disponivel": true
}
```

### PUT `/api/drivers/{id}`

**Request body:**
```json
{
  "titulo": "Fernando Alonso",
  "disponivel": false
}
```

**Response (200 OK):**
```json
{
  "id": 3,
  "titulo": "Fernando Alonso",
  "disponivel": false
}
```

## Persistência dos dados

⚠️ **Atenção:** esta API armazena os dados **somente em memória** (uma `List<Pilotos>` no código). Isso significa que todos os pilotos cadastrados, atualizados ou removidos durante a execução são perdidos assim que a aplicação é reiniciada (`dotnet run` novamente). Não há banco de dados nem persistência em disco.

## Collection de testes (Bruno)

A collection utilizada para testar todos os endpoints com o [Bruno](https://www.usebruno.com/) está disponível na pasta:

```
/bruno
```

Ela contém as seguintes requisições, cobrindo o ciclo completo de CRUD:

1. `00 - API no ar`
2. `01 - Listar`
3. `02 - Buscar por id`
4. `03 - Cadastrar`
5. `04 - Atualizar`
6. `05 - Remover`
7. `06 - Confirmar remoção`

Para usar: abra o Bruno, importe a pasta `bruno` como collection, configure o Environment `Local` com a variável `baseUrl` apontando para a URL exibida no `dotnet run`, e execute as requisições na ordem.

## Vídeo de demonstração

🎥 [Link do vídeo de demonstração](COLOQUE_AQUI_O_LINK_DO_SEU_VIDEO)
