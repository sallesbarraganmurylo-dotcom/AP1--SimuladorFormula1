public class Piloto
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public bool Disponivel { get; set; } = true;
}

public record PilotoCriarDTO(string Titulo);

public record PilotoAtualizarDTO(string Titulo, bool Disponivel);
