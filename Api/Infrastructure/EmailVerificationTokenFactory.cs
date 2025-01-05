using Api.Options;
using Domain.Users;
using Microsoft.Extensions.Options;

namespace Api.Infrastructure;

public class EmailVerificationTokenFactory
{
    private readonly EmailOptions _emailOptions;

    public EmailVerificationTokenFactory(IOptions<EmailOptions> emailOptions)
    {
        _emailOptions = emailOptions.Value;
    }

    public EmailVerificationToken Create(Guid userId)
    {
        string verificationToken = Guid.NewGuid().ToString();

        var emailVerificationToken = new EmailVerificationToken
        {
            UserId = userId,
            Token = verificationToken,
            ExpiresOnUtc = DateTime.UtcNow.AddHours(_emailOptions.VerificationTokenExpirationInHours)
        };

        return emailVerificationToken;
    }

    public string CreateLink(string token)
    {
        return $"{_emailOptions.VerificationRedirectUrl}?token={token}";
    }
}
