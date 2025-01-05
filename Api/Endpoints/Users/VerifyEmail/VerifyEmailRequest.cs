namespace Api.Endpoints.Users.VerifyEmail;

public record VerifyEmailRequest(
    string Token,
    string Password);
