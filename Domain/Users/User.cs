namespace Domain.Users;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public bool EmailVerified { get; set; } = false;
    public string? PasswordHash { get; set; }

    public DateTime CreatedOnUtc { get; set; } = DateTime.UtcNow;

    public DateTime? DeletedOnUtc { get; set; }
    public Guid? DeletedBy { get; set; }
}
