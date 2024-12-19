namespace Api.Endpoints.Users.Login;

public record LoginRequest(
    string Email,
    string Password);
