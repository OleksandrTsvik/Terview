using Domain.Users;

namespace Api.Endpoints.Users.Login;

public class LoginResponse
{
    public string Email { get; set; } = string.Empty;
    public List<PermissionType> Permissions { get; set; } = [];
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
}
