using Domain.Users;

namespace Api.Endpoints.Users.LoginByRefreshToken;

public class LoginByRefreshTokenResponse
{
    public string Email { get; set; } = string.Empty;
    public List<PermissionType> Permissions { get; set; } = [];
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
}
