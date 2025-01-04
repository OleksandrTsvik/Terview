namespace Api.Endpoints.Users.Get;

public class UserResponse
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public bool EmailVerified { get; set; }

    public DateTime CreatedOnUtc { get; set; }
    public DateTime? DeletedOnUtc { get; set; }
}
