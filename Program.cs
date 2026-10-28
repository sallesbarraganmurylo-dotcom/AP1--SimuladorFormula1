using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApiDbContext>(opcoes =>
    opcoes.UseSqlite("Data Source=formula1.db"));

var app = builder.Build();

// Garante que o banco exista e esteja com as migrations aplicadas
using (var escopo = app.Services.CreateScope())
{
    var db = escopo.ServiceProvider.GetRequiredService<ApiDbContext>();
    db.Database.Migrate();
}

// Serve o frontend (wwwroot/index.html) pela mesma origem da API
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/api/status", () => "Api Simulador de Corrida de Fórmula 1 está no ar!");

app.MapGet("/api/drivers", async (ApiDbContext db) =>
{
    return Results.Ok(await db.Pilotos.ToListAsync());
});

app.MapGet("/api/drivers/{id:int}", async (int id, ApiDbContext db) =>
{
    var piloto = await db.Pilotos.FindAsync(id);
    return piloto is null ? Results.NotFound() : Results.Ok(piloto);
});

app.MapPost("/api/drivers", async (PilotoCriarDTO dados, ApiDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(dados.Titulo))
    {
        return Results.BadRequest("O campo titulo é obrigatório.");
    }

    var piloto = new Piloto { Titulo = dados.Titulo, Disponivel = true };
    db.Pilotos.Add(piloto);
    await db.SaveChangesAsync();
    return Results.Created($"/api/drivers/{piloto.Id}", piloto);
});

app.MapPut("/api/drivers/{id:int}", async (int id, PilotoAtualizarDTO dados, ApiDbContext db) =>
{
    var piloto = await db.Pilotos.FindAsync(id);
    if (piloto is null)
    {
        return Results.NotFound();
    }

    piloto.Titulo = dados.Titulo;
    piloto.Disponivel = dados.Disponivel;
    await db.SaveChangesAsync();
    return Results.Ok(piloto);
});

app.MapDelete("/api/drivers/{id:int}", async (int id, ApiDbContext db) =>
{
    var piloto = await db.Pilotos.FindAsync(id);
    if (piloto is null)
    {
        return Results.NotFound();
    }

    db.Pilotos.Remove(piloto);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();