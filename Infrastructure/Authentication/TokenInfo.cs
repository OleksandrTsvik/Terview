namespace Infrastructure.Authentication;

public sealed record TokenInfo(string Token, DateTime ExpiresOnUtc);
