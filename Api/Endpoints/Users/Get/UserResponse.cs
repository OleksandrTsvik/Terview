namespace Api.Endpoints.Users.Get;

public class UserResponse
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public DateTime CreatedOnUtc { get; set; }
}
