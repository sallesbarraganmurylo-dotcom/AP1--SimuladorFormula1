using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var pilotos = new List<Pilotos>
{
    new Pilotos(1, "Lewis Hamilton", true),
    new Pilotos(2, "Max Verstappen", false)
};

app.MapGet("/", () => "Api Simulador de Corrida de Fórmula 1 está no ar!");

app.MapGet("/api/teams", () =>
{
    return Results.Ok(pilotos);
});

app.MapGet("/api/drivers/{id:int}", (int id) =>
{
    var pilotoEncontrado = pilotos.Find(pilotoDaLista => pilotoDaLista.id == id);
    if (pilotoEncontrado is null)
    {
        return Results.NotFound();
    }
    return Results.Ok(pilotoEncontrado);
});

app.MapPost("/api/drivers", (PilotosDTO dados) =>
{
    int proximoId = pilotos.Count + 1;
    var novoPiloto = new Pilotos(proximoId, dados.titulo, true);
    pilotos.Add(novoPiloto);
    return Results.Created($"/api/drivers/{novoPiloto.id}", novoPiloto);
});

app.MapPut("/api/drivers/{id:int}", (int id, PilotosAtualizarDTO dados) =>
{
    int indice = pilotos.FindIndex(pilotosDaLista => pilotosDaLista.id == id);
    if (indice == -1)
    {
        return Results.NotFound();
    }
    var atualizado = new Pilotos(id, dados.titulo, dados.disponivel);
    pilotos[indice] = atualizado;
    return Results.Ok(atualizado);
});

app.MapDelete("/api/drivers/{id:int}", (int id) =>
{
    int indice = pilotos.FindIndex(pilotoDaLista => pilotoDaLista.id == id);
    if (indice == -1)
    {
        return Results.NotFound();
    }
    pilotos.RemoveAt(indice);
    return Results.NoContent();
});

app.Run();

record Pilotos(int id, string titulo, bool disponivel);

record PilotosDTO(string titulo);

record PilotosAtualizarDTO(string titulo, bool disponivel);