namespace Api.Endpoints.Users.ResetPassword;

public record ResetPasswordRequest(
    string Token,
    string Password);
