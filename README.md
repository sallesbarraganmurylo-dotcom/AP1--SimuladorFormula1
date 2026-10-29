# ApiSimuladorFormula1

## Nome, tema e objetivo

**ApiSimuladorFormula1** é uma API REST desenvolvida em ASP.NET Core (.NET 10), com o tema de um simulador de corrida de Fórmula 1. A aplicação gerencia um cadastro de pilotos, permitindo listar, buscar, cadastrar, atualizar e remover pilotos (CRUD).

Na AP1 os dados ficavam em memória. Na **AP2** o projeto evoluiu: os dados agora são gravados em um banco **SQLite** com **Entity Framework Core**, e a API serve um **frontend** (HTML, CSS e JavaScript) integrado aos endpoints reais.

## Requisitos

- [.NET 10 SDK](https://dotnet.microsoft.com/download) (`dotnet --version` deve retornar 10.x)
- Ferramenta do Entity Framework (opcional, só para gerar novas migrations):
  ```bash
  dotnet tool install --global dotnet-ef
  ```

## Preparação do banco e execução

Na pasta do projeto (onde está o `.csproj`), execute:

```bash
dotnet restore
dotnet build
dotnet ef database update
dotnet run
```

O comando `dotnet ef database update` cria o arquivo `formula1.db` aplicando as migrations da pasta `Migrations/`. Além disso, a própria API aplica as migrations ao iniciar, então o banco também é criado sozinho no primeiro `dotnet run`.

O arquivo `formula1.db` não é versionado (está no `.gitignore`): cada pessoa gera o seu a partir das migrations.

## Como abrir a interface

Com a API rodando, abra no navegador:

```
http://localhost:5001
```

A interface (pasta `wwwroot`) é servida pela mesma origem da API e permite **listar, cadastrar, editar e excluir** pilotos, sempre usando os endpoints reais.

> Obs.: a porta pode variar conforme o `launchSettings.json`. Confira a porta exibida no terminal (`Now listening on: ...`).

## Estrutura do projeto

| Item | Descrição |
|------|-----------|
| `Program.cs` | Configuração da API, banco e rotas |
| `Piloto.cs` | Model `Piloto` e DTOs de criação e atualização |
| `ApiDbContext.cs` | `DbContext` do Entity Framework Core |
| `Migrations/` | Migrations do banco SQLite |
| `wwwroot/` | Frontend (HTML, CSS e JavaScript) |
| `bruno/` | Collection de testes do Bruno |

## Endpoints

| Método | Rota | Descrição | Respostas |
|--------|------|-----------|-----------|
| GET | `/api/status` | Verifica se a API está no ar. | 200 |
| GET | `/api/drivers` | Lista todos os pilotos. | 200 |
| GET | `/api/drivers/{id}` | Busca um piloto pelo id. | 200, 404 |
| POST | `/api/drivers` | Cadastra um novo piloto. | 201, 400 |
| PUT | `/api/drivers/{id}` | Atualiza um piloto existente. | 200, 404 |
| DELETE | `/api/drivers/{id}` | Remove um piloto. | 204, 404 |

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
  "id": 1,
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
  "id": 1,
  "titulo": "Fernando Alonso",
  "disponivel": false
}
```

## Persistência dos dados

Os dados são gravados em um banco SQLite (`formula1.db`) pelo Entity Framework Core. Os pilotos que não forem excluídos continuam disponíveis depois de reiniciar a API.

## Collection de testes (Bruno)

A collection para testar os endpoints está na pasta `bruno`. Para usar: abra o Bruno, importe a pasta `bruno` como collection e configure o Environment `Local` com a variável `baseUrl` apontando para a URL exibida no `dotnet run`.

As rotas da API mudaram desde a AP1: a listagem agora é `GET /api/drivers` e a verificação de status é `GET /api/status`.

## Vídeo de demonstração — AP2

🎥 [Link do vídeo de demonstração da AP2](https://drive.google.com/drive/folders/1e966TW2xKgwLcTgVNTAK1XPMGiSVHmpB?usp=sharing))
